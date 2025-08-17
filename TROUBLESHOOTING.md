# 🛠️ Complete Troubleshooting Guide - JengaPrompts Pro

## 📋 Quick Diagnosis Checklist

Before diving deep, run through this 2-minute checklist:

- [ ] **API Key**: Is `GEMINI_API_KEY` set in `.env.local`?
- [ ] **Server Running**: Is `npm run dev` active without errors?
- [ ] **Browser Console**: Any red error messages in F12 → Console?
- [ ] **Network**: Can you access [Google AI Studio](https://makersuite.google.com)?
- [ ] **Environment**: Did you restart the server after changing `.env.local`?

---

## 🚨 Issue #1: App Not Generating Prompts

### Symptoms
- App loads correctly and UI appears functional
- Shows "Enhancing..." or loading spinner
- Eventually shows "This is taking longer than expected"
- No prompts are generated or returned

### Root Cause Analysis

#### 🔑 **API Key Issues** (90% of cases)

**Diagnosis Steps:**
1. Open browser Developer Tools (`F12`) → Console tab
2. Look for "🔑 API Key Debug:" messages
3. Check the API key status output:

```
✅ GOOD:
🔑 API Key Debug:
- Final API key: FOUND
- API key length: 39
- API key preview: AIzaSyB...

❌ BAD:
🔑 API Key Debug:
- Final API key: NOT FOUND
- API key length: 0
- API key preview: undefined
```

**Solutions by Scenario:**

**Scenario A: API Key Not Found**
```bash
# Create or update .env.local file
echo "GEMINI_API_KEY=your_actual_api_key_here" > .env.local
echo "VITE_GEMINI_API_KEY=your_actual_api_key_here" >> .env.local

# Restart development server
npm run dev
```

**Scenario B: Invalid API Key Format**
- API key should start with `AIza`
- Should be 39+ characters long
- Get a new key from [Google AI Studio](https://makersuite.google.com/app/apikey)

**Scenario C: API Key Permissions**
- Ensure API key has Gemini API access enabled
- Check Google Cloud Console for API restrictions
- Verify billing is set up (may be required)

#### 🌐 **Network & CORS Issues**

**Check Browser Console for:**
```
Access to fetch at 'https://generativelanguage.googleapis.com...' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solutions:**
1. **Corporate Firewall**: Try from personal network/mobile hotspot
2. **VPN Issues**: Disconnect VPN and retry
3. **ISP Blocking**: Some ISPs block AI service endpoints
4. **Browser Extensions**: Disable ad blockers temporarily

#### ⚡ **Environment Variable Loading Issues**

**Common Problems:**
- `.env.local` file in wrong location (must be in project root)
- Missing `VITE_` prefix for client-side variables
- Server not restarted after environment changes

**Debug Steps:**
```bash
# Check if .env.local exists
ls -la .env.local

# Verify contents
cat .env.local

# Should show:
# GEMINI_API_KEY=AIza...
# VITE_GEMINI_API_KEY=AIza...
```

#### 🚦 **API Rate Limiting**

**Check Console for:**
```
429 Too Many Requests
Rate limit exceeded
```

**Solutions:**
- Wait 5-10 minutes before retrying
- Upgrade to paid Gemini API plan
- Implement request throttling

---

## 🚨 Issue #2: App Won't Start or Load

### Symptoms
- `npm run dev` fails
- Blank page or build errors
- Server crashes on startup

### Solutions

#### **Dependency Issues**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Try starting again
npm run dev
```

#### **Port Conflicts**
```bash
# Check what's using port 5173
lsof -i :5173

# Kill the process (replace PID)
kill -9 [PID]

# Or use different port
npm run dev -- --port 3000
```

#### **Node.js Version Issues**
```bash
# Check Node.js version (needs 18+)
node --version

# If too old, update Node.js
# Use nvm if installed:
nvm install 18
nvm use 18
```

---

## 🚨 Issue #3: Build or Deployment Failures

### Symptoms
- `npm run build` fails
- Production deployment errors
- Missing environment variables in production

### Solutions

#### **Build Errors**
```bash
# Check for TypeScript errors
npm run type-check

# Fix ESLint issues
npm run lint:fix

# Clean build
rm -rf dist
npm run build
```

#### **Deployment Issues**

**Vercel:**
1. Add environment variables in Vercel dashboard:
   ```
   GEMINI_API_KEY=your_key_here
   VITE_GEMINI_API_KEY=your_key_here
   ```
2. Check function logs in Vercel dashboard
3. Ensure all files are committed to git

**Netlify:**
1. Set environment variables in Site settings → Environment variables
2. Ensure build command is `npm run build`
3. Check deploy logs for errors

---

## 🚨 Issue #4: Slow or Hanging Requests

### Symptoms
- Prompts take very long to generate (>30 seconds)
- Requests hang or timeout
- Intermittent generation failures

### Solutions

#### **Network Optimization**
```javascript
// Add to your API call code
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

fetch(url, {
  signal: controller.signal,
  // ... other options
}).finally(() => clearTimeout(timeoutId));
```

#### **API Configuration**
- Reduce `maxOutputTokens` in API request
- Lower `temperature` for faster, more deterministic responses
- Use `gemini-pro` instead of `gemini-pro-vision` if not using images

---

## 🛠️ Advanced Debugging Tools

### Debug API Key Detection
Add this to your component:
```javascript
const debugApiKey = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  console.log("🔍 API Key Debug:", {
    found: !!key,
    length: key?.length || 0,
    preview: key?.substring(0, 10) + "...",
    environment: import.meta.env.MODE
  });
};
```

### Network Request Inspector
```javascript
// Add to your fetch calls
.catch(error => {
  console.error("🚨 API Error Details:", {
    message: error.message,
    status: error.status,
    url: error.url,
    timestamp: new Date().toISOString()
  });
});
```

### Environment Variable Validator
```bash
# Create debug script (debug-env.js)
console.log("Environment Debug:", {
  NODE_ENV: process.env.NODE_ENV,
  GEMINI_KEY_SET: !!process.env.GEMINI_API_KEY,
  VITE_GEMINI_KEY_SET: !!process.env.VITE_GEMINI_API_KEY,
  ALL_ENV_VARS: Object.keys(process.env).filter(key => key.includes('GEMINI'))
});

# Run it
node debug-env.js
```

---

## 🆘 Emergency Quick Fixes

### Complete Reset
```bash
# Nuclear option - reset everything
rm -rf node_modules package-lock.json .env.local dist
npm cache clean --force
npm install
echo "GEMINI_API_KEY=your_key_here" > .env.local
echo "VITE_GEMINI_API_KEY=your_key_here" >> .env.local
npm run dev
```

### Test API Key Directly
```bash
# Replace YOUR_KEY with actual API key
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello, respond with just the word SUCCESS"}]}]}' \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_KEY"
```

Expected response:
```json
{
  "candidates": [
    {
      "content": {
        "parts": [{"text": "SUCCESS"}]
      }
    }
  ]
}
```

---

## 📞 Getting Additional Help

### Before Asking for Help, Gather:
1. **Error messages** from browser console
2. **Network tab** screenshots showing failed requests
3. **Environment details**: OS, Node.js version, browser
4. **Steps to reproduce** the issue
5. **API key status** (working/not working - don't share the actual key)

### Support Channels
- **GitHub Issues**: [Create detailed bug report](https://github.com/your-org/jengaprompts-pro/issues)
- **Discussions**: [Community help](https://github.com/your-org/jengaprompts-pro/discussions)
- **Email**: support@jengaprompts.com

### Issue Report Template
```
**Environment:**
- OS: [Windows/Mac/Linux]
- Node.js: [version]
- Browser: [Chrome/Firefox/Safari + version]

**Problem:**
[Clear description of what's not working]

**Expected Behavior:**
[What should happen]

**Console Errors:**
[Copy exact error messages]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Additional Context:**
[Any other relevant information]
```

---

## 🎯 Prevention Tips

1. **Always restart** the dev server after changing `.env.local`
2. **Use browser incognito mode** to test without cache
3. **Keep API keys secure** - never commit to git
4. **Monitor usage** in Google Cloud Console to avoid rate limits
5. **Test changes locally** before deploying to production

---

*💡 **Pro Tip**: 90% of issues are solved by verifying the API key setup and restarting the development server. Start there!*