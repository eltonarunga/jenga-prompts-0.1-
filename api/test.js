// Improved Vercel API endpoint with proper HTTP handling
export default function handler(req, res) {
  // Set CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    default:
      return res.status(405).json({ 
        error: 'Method not allowed',
        allowedMethods: ['GET', 'POST'] 
      });
  }
}

function handleGet(req, res) {
  const { name } = req.query;
  
  return res.status(200).json({
    message: name ? `Hello, ${name}!` : 'Hello from Vercel!',
    timestamp: new Date().toISOString(),
    method: 'GET',
    environment: process.env.NODE_ENV || 'development'
  });
}

function handlePost(req, res) {
  try {
    const { name, message } = req.body || {};
    
    return res.status(200).json({
      message: `Hello${name ? `, ${name}` : ''}! You sent: "${message || 'No message'}"`,
      timestamp: new Date().toISOString(),
      method: 'POST',
      received: req.body
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Invalid JSON in request body',
      message: error.message
    });
  }
}