const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate user
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// Middleware to authorize admin
const authorizeAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
  next();
};

// Middleware to authorize user or admin
const authorizeUserOrAdmin = (req, res, next) => {
  const userId = req.params.userId || req.body.userId;
  
  if (req.user.isAdmin || req.user._id.toString() === userId) {
    return next();
  }
  
  return res.status(403).json({ error: 'Access denied. Insufficient privileges.' });
};

module.exports = {
  authenticateUser,
  authorizeAdmin,
  authorizeUserOrAdmin
};
