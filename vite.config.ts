import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode, command }) => {
  // Load environment variables with proper prefix handling
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  const isDevelopment = mode === 'development';

  console.log(`🏗️  Building in ${mode} mode...`);
  
  return {
    // Core plugins configuration
    plugins: [
      react({
        // Enable Fast Refresh in development
        fastRefresh: isDevelopment,
        // JSX runtime configuration
        jsxRuntime: 'automatic',
        // Babel configuration for better optimization
        babel: {
          plugins: isProduction ? [
            ['babel-plugin-react-remove-properties', { properties: ['data-testid'] }]
          ] : []
        }
      }),
    ],

    // Environment variable handling
    define: {
      // API key handling with fallbacks
      'process.env.GEMINI_API_KEY': JSON.stringify(
        env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY
      ),
      'process.env.VITE_GEMINI_API_KEY': JSON.stringify(
        env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY
      ),
      // Build-time constants
      '__APP_VERSION__': JSON.stringify(process.env.npm_package_version || '1.0.0'),
      '__BUILD_TIME__': JSON.stringify(new Date().toISOString()),
      '__DEV__': JSON.stringify(isDevelopment),
      // Clean process.env to prevent leaks
      'process.env': JSON.stringify({
        NODE_ENV: mode,
        // Only include safe environment variables
        ...(isDevelopment && {
          VITE_GEMINI_API_KEY: env.VITE_GEMINI_API_KEY
        })
      })
    },

    // Path resolution
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@services': path.resolve(__dirname, './src/services'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@types': path.resolve(__dirname, './src/types'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@styles': path.resolve(__dirname, './src/styles'),
      }
    },

    // Development server configuration
    server: {
      port: 5173,
      host: true, // Listen on all addresses
      open: false, // Don't auto-open browser
      cors: true,
      
      // Enhanced proxy configuration
      proxy: {
        '/api': {
          target: env.VITE_PROXY_TARGET || 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
          timeout: 60000, // 60 second timeout
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.log('🚨 Proxy error:', err);
            });
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log(`📡 Proxying ${req.method} ${req.url}`);
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log(`📥 Proxy response ${proxyRes.statusCode} for ${req.url}`);
            });
          }
        }
      }
    },

    // Preview server configuration (for production testing)
    preview: {
      port: 4173,
      host: true,
      cors: true,
      // Headers for local production testing
      headers: {
        'Cache-Control': 'no-cache'
      }
    },

    // Build configuration
    build: {
      // Output directory
      outDir: 'dist',
      
      // Generate source maps in development
      sourcemap: isDevelopment ? 'inline' : false,
      
      // Minification
      minify: isProduction ? 'esbuild' : false,
      
      // Target modern browsers in production
      target: isProduction ? 'es2020' : 'esnext',
      
      // Chunk size warnings
      chunkSizeWarningLimit: 1000,
      
      // Rollup options for advanced bundling
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html')
        },
        output: {
          // Manual chunk splitting for better caching
          manualChunks: {
            // Vendor chunks
            'vendor-react': ['react', 'react-dom'],
            'vendor-ui': ['lucide-react', 'clsx'],
            // Utility chunks  
            'utils': ['./src/utils/index.ts'],
            // Service chunks
            'services': ['./src/services/geminiApi.ts']
          },
          // Asset file naming
          chunkFileNames: isProduction 
            ? 'assets/[name]-[hash].js'
            : 'assets/[name].js',
          entryFileNames: isProduction
            ? 'assets/[name]-[hash].js' 
            : 'assets/[name].js',
          assetFileNames: isProduction
            ? 'assets/[name]-[hash][extname]'
            : 'assets/[name][extname]'
        },
        
        // External dependencies (if any)
        external: [],
        
        // Tree shaking configuration
        treeshake: isProduction ? {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          unknownGlobalSideEffects: false
        } : false
      },
      
      // CSS code splitting
      cssCodeSplit: true,
      
      // Inline CSS imports smaller than this limit
      assetsInlineLimit: 4096,
      
      // Report compressed size
      reportCompressedSize: isProduction,
      
      // Emit manifest for deployment tools
      manifest: isProduction,
      
      // Write bundle info
      write: true
    },

    // CSS configuration
    css: {
      // CSS modules configuration
      modules: {
        localsConvention: 'camelCaseOnly'
      },
      
      // PostCSS configuration
      postcss: './postcss.config.js',
      
      // CSS preprocessing
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`
        }
      },
      
      // Development source maps
      devSourcemap: isDevelopment
    },

    // Optimization configuration
    optimizeDeps: {
      // Pre-bundle these dependencies
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'lucide-react'
      ],
      
      // Exclude these from pre-bundling
      exclude: [
        // Add any problematic dependencies here
      ],
      
      // ESBuild options for dependency optimization
      esbuildOptions: {
        target: 'es2020'
      }
    },

    // ESBuild configuration
    esbuild: {
      // Remove debugger statements in production
      drop: isProduction ? ['console', 'debugger'] : [],
      
      // JSX configuration
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      
      // Target specification
      target: 'es2020'
    },

    // Worker configuration
    worker: {
      format: 'es',
      plugins: () => [react()]
    },

    // JSON configuration
    json: {
      namedExports: true,
      stringify: false
    },

    // Logging level
    logLevel: isDevelopment ? 'info' : 'warn',

    // Clear screen on rebuild
    clearScreen: false,

    // Environment configuration
    envDir: './',
    envPrefix: 'VITE_',

    // Public directory
    publicDir: 'public',

    // Base path for deployment
    base: env.VITE_BASE_PATH || '/',
  };
});