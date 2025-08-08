const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('../lib/database');
const dotenv = require('dotenv');

const app = express();
dotenv.config()
// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://mahavir-studio.vercel.app'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined'));

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/products', require('../routes/products'));
app.use('/api/paints', require('../routes/paints'));
app.use('/api/categories', require('../routes/categories'));
app.use('/api/users', require('../routes/users'));
app.use('/api/orders', require('../routes/orders'));
app.use('/api/reviews', require('../routes/reviews'));
app.use('/api/cart', require('../routes/cart'));
app.use('/api/wishlist', require('../routes/wishlist'));

// Admin Routes
app.use('/api/admin', require('../routes/admin'));


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Mahavir Studio API',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      paints: '/api/paints',
      categories: '/api/categories',
      users: '/api/users',
      orders: '/api/orders',
      reviews: '/api/reviews',
      cart: '/api/cart',
      wishlist: '/api/wishlist',
      admin: '/api/admin'
    },
    adminPanel: {
      info: '/api/admin/info',
      auth: '/api/admin/auth',
      dashboard: '/api/admin/dashboard',
      management: {
        categories: '/api/admin/categories',
        paints: '/api/admin/paints',
        products: '/api/admin/products',
        orders: '/api/admin/orders',
        users: '/api/admin/users'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.code === 11000) {
    return res.status(400).json({
      error: 'Duplicate Entry',
      message: 'This record already exists'
    });
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Mahavir Studio API Server running on port ${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
