const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://generativelanguage.googleapis.com"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com', 'https://www.your-domain.com']
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Limit each IP
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// Request parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Validation middleware
const validateApiKey = (req, res, next) => {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: 'Server configuration error',
      message: 'Gemini API key not configured'
    });
  }
  next();
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime()
  });
});

// API status endpoint
app.get('/api/status', validateApiKey, (req, res) => {
  res.json({
    status: 'ready',
    service: 'Gemini API Proxy',
    timestamp: new Date().toISOString(),
    endpoints: {
      models: '/api/v1beta/models',
      generateContent: '/api/v1beta/models/{model}:generateContent'
    }
  });
});

// Enhanced proxy middleware
app.use('/api', validateApiKey, createProxyMiddleware({
  target: 'https://generativelanguage.googleapis.com',
  changeOrigin: true,
  secure: true,
  timeout: 30000, // 30 second timeout
  
  pathRewrite: (path, req) => {
    const newPath = path.replace(/^\/api/, '');
    console.log(`[PROXY] ${req.method} ${path} -> ${newPath}`);
    return newPath;
  },

  onProxyReq: (proxyReq, req, res) => {
    // Add authentication header
    proxyReq.setHeader('X-Goog-Api-Key', process.env.GEMINI_API_KEY);
    
    // Add user agent
    proxyReq.setHeader('User-Agent', 'JengaPrompts-Pro/1.0');
    
    // Handle request body
    if (req.body && Object.keys(req.body).length > 0) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }

    // Log request details in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[PROXY REQ] ${req.method} ${req.url}`);
      if (req.body) {
        console.log('[PROXY REQ BODY]', JSON.stringify(req.body, null, 2));
      }
    }
  },

  onProxyRes: (proxyRes, req, res) => {
    // Add custom headers
    proxyRes.headers['X-Powered-By'] = 'JengaPrompts-Pro';
    
    // Log response in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[PROXY RES] ${proxyRes.statusCode} ${proxyRes.statusMessage}`);
    }
  },

  onError: (err, req, res) => {
    console.error('[PROXY ERROR]', {
      message: err.message,
      code: err.code,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    });

    // Send appropriate error response
    if (err.code === 'ECONNREFUSED') {
      res.status(503).json({
        error: 'Service temporarily unavailable',
        message: 'Unable to connect to AI service',
        code: 'CONNECTION_REFUSED'
      });
    } else if (err.code === 'ETIMEDOUT') {
      res.status(504).json({
        error: 'Gateway timeout',
        message: 'Request to AI service timed out',
        code: 'TIMEOUT'
      });
    } else {
      res.status(500).json({
        error: 'Proxy error',
        message: 'An error occurred while processing your request',
        code: err.code || 'UNKNOWN_ERROR'
      });
    }
  }
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.url} not found`,
    availableRoutes: {
      health: 'GET /health',
      apiStatus: 'GET /api/status',
      proxy: 'POST /api/v1beta/models/{model}:generateContent'
    }
  });
});

// Graceful shutdown
const server = app.listen(process.env.PORT || 3001, () => {
  const port = server.address().port;
  console.log(`🚀 JengaPrompts Pro API Server running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🔍 API status: http://localhost:${port}/api/status`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app;