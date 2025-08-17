# COMPLETE VERCEL DEPLOYMENT GUIDE

## Pre-Deployment Checklist ✅

### 1. **Project Structure Validation**
```bash
# Verify your project structure
my-app/
├── api/                    # Vercel serverless functions
│   └── gemini-stream.js
├── src/
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vercel.json            # Vercel configuration
└── .env.local             # Local environment (gitignored)
```

### 2. **Package.json Scripts**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit"
  }
}
```

## Critical Issues & Solutions 🚨

### 1. **TypeScript Configuration** (CRITICAL)
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "types": ["vite/client"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 2. **Vite Configuration** (CRITICAL)
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env': process.env
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react']
        }
      }
    },
    sourcemap: false,
    minify: 'terser'
  },
  server: {
    port: 3000,
    open: true
  }
})
```

### 3. **Vercel Configuration** (CRITICAL)
```json
{
  "version": 2,
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "functions": {
    "api/gemini-stream.js": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        },
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 4. **Environment Variables Setup** (CRITICAL)

#### Local Development (.env.local)
```bash
# Development environment
VITE_GEMINI_API_KEY=your_api_key_here
VITE_APP_ENV=development
VITE_API_BASE_URL=http://localhost:3000
```

#### Vercel Dashboard Environment Variables
```bash
# Production environment variables
GEMINI_API_KEY=your_actual_api_key_here
VITE_GEMINI_API_KEY=your_actual_api_key_here
VITE_APP_ENV=production
VITE_API_BASE_URL=https://your-app.vercel.app
NODE_ENV=production
```

### 5. **Serverless API Function** (CRITICAL)
```javascript
// api/gemini-stream.js
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // CORS handling
  if (req.method === 'OPTIONS') {
    res.status(200).json({ status: 'OK' });
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userPrompt, mode, options } = req.body;
    
    if (!userPrompt) {
      return res.status(400).json({ error: 'Missing userPrompt' });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('API key not found in environment variables');
      return res.status(500).json({ error: 'API configuration error' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Set up streaming response
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    
    const result = await model.generateContentStream(userPrompt);
    
    let fullResponse = '';
    
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        fullResponse += chunkText;
        res.write(chunkText);
      }
    }
    
    res.end();
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate content',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
```

### 6. **Client-Side Service** (CRITICAL)
```typescript
// src/services/geminiService.ts
interface StreamOptions {
  userPrompt: string;
  mode: string;
  options: any;
  onChunk: (chunk: string) => void;
  onComplete: (fullText: string) => void;
  onError: (error: Error) => void;
}

export async function getEnhancedPromptStream({
  userPrompt,
  mode,
  options,
  onChunk,
  onComplete,
  onError
}: StreamOptions): Promise<void> {
  try {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
    
    const response = await fetch(`${apiUrl}/api/gemini-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userPrompt,
        mode,
        options
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get response reader');
    }

    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      if (chunk) {
        fullText += chunk;
        onChunk(chunk);
      }
    }

    onComplete(fullText);
    
  } catch (error) {
    console.error('Streaming error:', error);
    onError(error instanceof Error ? error : new Error('Unknown error'));
  }
}
```

## Deployment Process 🚀

### Step 1: Pre-deployment Testing
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Type checking
npm run type-check

# Build locally
npm run build

# Test build locally
npm run preview
```

### Step 2: Vercel CLI Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (first time)
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls
```

### Step 3: GitHub Integration (Recommended)
1. Connect your GitHub repository to Vercel
2. Enable automatic deployments on push to main
3. Configure preview deployments for pull requests
4. Set up environment variables in Vercel dashboard

## Advanced Debugging 🔍

### Enable Debug Logging
```typescript
// Add to your service files
const DEBUG = import.meta.env.VITE_APP_ENV === 'development';

if (DEBUG) {
  console.log('Debug info:', { userPrompt, mode, options });
}
```

### Vercel Function Logs
```bash
# View function logs
vercel logs [deployment-url]

# Follow logs in real-time
vercel logs [deployment-url] --follow
```

### Common Error Solutions

#### 1. **"Module not found" errors**
```bash
# Clear Vercel cache and redeploy
vercel --force

# Check node_modules in build
npm run build -- --debug
```

#### 2. **API timeout errors**
```javascript
// Increase timeout in vercel.json
{
  "functions": {
    "api/*.js": {
      "maxDuration": 30
    }
  }
}
```

#### 3. **Environment variable issues**
```bash
# List environment variables
vercel env ls

# Add environment variable
vercel env add GEMINI_API_KEY

# Pull environment variables locally
vercel env pull .env.local
```

## Performance Optimization 📈

### 1. **Bundle Analysis**
```bash
# Analyze bundle size
npm run build -- --analyze

# Check for duplicate dependencies
npx duplicate-package-checker
```

### 2. **Code Splitting**
```typescript
// Lazy load components
import { lazy, Suspense } from 'react';

const PromptLibrary = lazy(() => import('./components/PromptLibrary'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PromptLibrary />
    </Suspense>
  );
}
```

### 3. **Caching Strategy**
```json
// In vercel.json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## Security Best Practices 🔒

### 1. **Environment Variables**
- Never commit API keys to version control
- Use different keys for development and production
- Regularly rotate API keys

### 2. **API Security**
```javascript
// Add rate limiting
const rateLimit = new Map();

export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100;

  if (rateLimit.has(ip)) {
    const requests = rateLimit.get(ip);
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    
    validRequests.push(now);
    rateLimit.set(ip, validRequests);
  } else {
    rateLimit.set(ip, [now]);
  }

  // Your API logic here
}
```

### 3. **Content Security Policy**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: https:;"
        }
      ]
    }
  ]
}
```

## Monitoring & Analytics 📊

### 1. **Vercel Analytics**
```bash
# Install Vercel Analytics
npm install @vercel/analytics

# Add to your app
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

### 2. **Performance Monitoring**
```typescript
// Track Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Send to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## Final Checklist ✅

- [ ] TypeScript compiles without errors
- [ ] Environment variables configured in Vercel
- [ ] API functions work in production
- [ ] Streaming responses function correctly
- [ ] All routes accessible (SPA routing)
- [ ] CORS configured properly
- [ ] Performance optimizations applied
- [ ] Security headers configured
- [ ] Monitoring set up
- [ ] Error handling implemented
- [ ] Mobile responsive design tested
- [ ] SEO meta tags added
- [ ] Favicon and PWA manifest included

Your application should now deploy successfully to Vercel with optimal performance and security! 🎉