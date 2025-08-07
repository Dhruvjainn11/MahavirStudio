const { body, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

const validateUserLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

// Product validation rules
const validateProduct = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Product name must be between 2 and 100 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('categoryId').isMongoId().withMessage('Invalid category ID'),
  body('type').isIn(['hardware', 'paint']).withMessage('Type must be either hardware or paint'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  handleValidationErrors
];

// Category validation rules
const validateCategory = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Category name must be between 2 and 50 characters'),
  body('type').isIn(['hardware', 'paint']).withMessage('Type must be either hardware or paint'),
  handleValidationErrors
];

// Order validation rules
const validateOrder = [
    // Validate the top-level 'items' array
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    // Validate fields within each 'item'
    body('items.*._id').isMongoId().withMessage('Invalid product ID for an item'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1 for an item'),

    // Update payment method validation to include 'netbanking'
    body('paymentMethod').isIn(['card', 'debit_card', 'paypal', 'cod', 'upi', 'netbanking']).withMessage('Invalid payment method'),

    // Update billingDetails validation
    // If you always combine firstName and lastName on frontend to send as 'fullname',
    // then this validation is fine as is, but consider if backend should store them separately.
    body('billingDetails.fullname').trim().isLength({ min: 2 }).withMessage('Billing full name is required'),
    body('billingDetails.email').isEmail().withMessage('Valid billing email is required'),
    body('billingDetails.phone').trim().isLength({ min: 10, max: 10 }).withMessage('Valid 10-digit phone number is required'), // Added phone validation
    body('billingDetails.address').trim().notEmpty().withMessage('Address is required'),
    body('billingDetails.city').trim().notEmpty().withMessage('City is required'),
    body('billingDetails.state').trim().notEmpty().withMessage('State is required'),
    body('billingDetails.pincode').trim().isLength({ min: 6, max: 6 }).withMessage('Valid 6-digit pincode is required'),

    handleValidationErrors // Your custom error handler
];

// Review validation rules
const validateReview = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().isLength({ min: 10, max: 500 }).withMessage('Comment must be between 10 and 500 characters'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateProduct,
  validateCategory,
  validateOrder,
  validateReview,
  handleValidationErrors
};
