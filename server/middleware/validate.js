const mongoose = require('mongoose');

// Verify that a route parameter is a valid 24-character hex MongoDB ObjectId
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid identifier provided: '${id}'`
      });
    }
    next();
  };
};

// Custom header / Origin CSRF mitigation for mutating HTTP methods
const csrfCheck = (req, res, next) => {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  // Allow if custom AJAX header is present or Origin matches client URL
  const xRequestedWith = req.headers['x-requested-with'];
  const origin = req.headers.origin;
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  // In test environments or when custom header is sent
  if (
    process.env.NODE_ENV === 'test' ||
    xRequestedWith === 'XMLHttpRequest' ||
    (origin && origin.startsWith(clientUrl))
  ) {
    return next();
  }

  // Also allow requests from local client development
  if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Request blocked: Missing anti-CSRF security header.'
  });
};

module.exports = { validateObjectId, csrfCheck };
