const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token = null;

    // 1. Primary auth source: HTTP-only secure cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. Secondary fallback (allows automated tests or Bearer header)
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to continue.'
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'shopsphere_secure_jwt_secret_dev_2026_key_98765'
    );

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session. Please log in again.'
      });
    }
    return next(error);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    let token = null;
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'shopsphere_secure_jwt_secret_dev_2026_key_98765'
    );
    const user = await User.findById(decoded.id);
    if (user) {
      req.user = user;
    }
    next();
  } catch {
    // If token invalid, simply proceed as guest
    next();
  }
};

module.exports = { protect, optionalAuth };
