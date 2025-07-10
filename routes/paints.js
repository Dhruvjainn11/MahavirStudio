const express = require('express');
const Paint = require('../models/Paint');
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Validation for paint
const validatePaint = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Paint name must be between 2 and 100 characters'),
  body('shadeCode').trim().isLength({ min: 1 }).withMessage('Shade code is required'),
  body('brand').trim().isLength({ min: 1 }).withMessage('Brand is required'),
  body('colorFamily').trim().isLength({ min: 1 }).withMessage('Color family is required'),
  body('finish').trim().isLength({ min: 1 }).withMessage('Finish is required'),
  body('categoryId').isMongoId().withMessage('Invalid category ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }
    next();
  }
];

// Get all paints with filtering, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      brand,
      colorFamily,
      finish,
      categoryId,
      search
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (colorFamily) filter.colorFamily = new RegExp(colorFamily, 'i');
    if (finish) filter.finish = new RegExp(finish, 'i');
    if (categoryId) filter.categoryId = categoryId;
    
    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sortObj = {};
    if (search) {
      sortObj.score = { $meta: 'textScore' };
    }
    sortObj[sort] = order === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const paints = await Paint.find(filter)
      .populate('categoryId', 'name type')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Paint.countDocuments(filter);

    res.json({
      paints,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: skip + parseInt(limit) < total,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get paints error:', error);
    res.status(500).json({ error: 'Server error while fetching paints' });
  }
});

// Get single paint by ID
router.get('/:id', async (req, res) => {
  try {
    const paint = await Paint.findById(req.params.id)
      .populate('categoryId', 'name type description');
    
    if (!paint || !paint.isActive) {
      return res.status(404).json({ error: 'Paint not found' });
    }

    res.json(paint);
  } catch (error) {
    console.error('Get paint error:', error);
    res.status(500).json({ error: 'Server error while fetching paint' });
  }
});

// Create new paint (Admin only)
router.post('/', authenticateUser, authorizeAdmin, validatePaint, async (req, res) => {
  try {
    const paint = new Paint(req.body);
    await paint.save();
    
    const populatedPaint = await Paint.findById(paint._id)
      .populate('categoryId', 'name type');
    
    res.status(201).json({
      message: 'Paint created successfully',
      paint: populatedPaint
    });
  } catch (error) {
    console.error('Create paint error:', error);
    res.status(500).json({ error: 'Server error while creating paint' });
  }
});

// Update paint (Admin only)
router.put('/:id', authenticateUser, authorizeAdmin, validatePaint, async (req, res) => {
  try {
    const paint = await Paint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('categoryId', 'name type');
    
    if (!paint) {
      return res.status(404).json({ error: 'Paint not found' });
    }

    res.json({
      message: 'Paint updated successfully',
      paint
    });
  } catch (error) {
    console.error('Update paint error:', error);
    res.status(500).json({ error: 'Server error while updating paint' });
  }
});

// Delete paint (Admin only) - Soft delete
router.delete('/:id', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const paint = await Paint.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!paint) {
      return res.status(404).json({ error: 'Paint not found' });
    }

    res.json({ message: 'Paint deleted successfully' });
  } catch (error) {
    console.error('Delete paint error:', error);
    res.status(500).json({ error: 'Server error while deleting paint' });
  }
});

// Get paints by category
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;
    
    const filter = { 
      categoryId: req.params.categoryId,
      isActive: true 
    };

    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const paints = await Paint.find(filter)
      .populate('categoryId', 'name type')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Paint.countDocuments(filter);

    res.json({
      paints,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get paints by category error:', error);
    res.status(500).json({ error: 'Server error while fetching paints by category' });
  }
});

// Get paints by brand
router.get('/brand/:brand', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;
    
    const filter = { 
      brand: new RegExp(req.params.brand, 'i'),
      isActive: true 
    };

    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const paints = await Paint.find(filter)
      .populate('categoryId', 'name type')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Paint.countDocuments(filter);

    res.json({
      paints,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get paints by brand error:', error);
    res.status(500).json({ error: 'Server error while fetching paints by brand' });
  }
});

// Get unique brands
router.get('/filters/brands', async (req, res) => {
  try {
    const brands = await Paint.distinct('brand', { isActive: true });
    res.json(brands);
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({ error: 'Server error while fetching brands' });
  }
});

// Get unique color families
router.get('/filters/color-families', async (req, res) => {
  try {
    const colorFamilies = await Paint.distinct('colorFamily', { isActive: true });
    res.json(colorFamilies);
  } catch (error) {
    console.error('Get color families error:', error);
    res.status(500).json({ error: 'Server error while fetching color families' });
  }
});

// Get unique finishes
router.get('/filters/finishes', async (req, res) => {
  try {
    const finishes = await Paint.distinct('finish', { isActive: true });
    res.json(finishes);
  } catch (error) {
    console.error('Get finishes error:', error);
    res.status(500).json({ error: 'Server error while fetching finishes' });
  }
});

module.exports = router;
