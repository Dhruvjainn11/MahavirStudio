const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate user
// middleware/auth.js


const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1].trim();

   

    const decoded = jwt.verify(token, process.env.JWT_SECRET);


       // Verify user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log('Auth Error: User not found from decoded token ID'); // Debug log <-- THIS IS LIKELY THE PROBLEM
      return res.status(401).json({ error: 'User no longer exists' });
    }

    if (!user.isActive) {
      console.log('Auth Error: User account is deactivated'); // Debug log <-- OR THIS ONE
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    req.user = user;
    console.log('User authenticated and req.user set:', req.user._id); // Debug log
    next();

    // Verify user still exists
    // const user = await User.findById(decoded.userId);
    // if (!user) {
    //   return res.status(401).json({ error: 'User no longer exists' });
    // }

    // req.user = user;
    // next();
  } catch (err) {
    console.error('Authentication error:', err);

    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expired' });
    }

    return res.status(403).json({ error: 'Invalid token' });
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
