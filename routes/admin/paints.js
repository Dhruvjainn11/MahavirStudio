const express = require('express');
const { body, validationResult } = require('express-validator');
const Paint = require('../../models/Paint');
const Category = require('../../models/Category');
const { authenticateUser, authorizeAdmin } = require('../../middleware/auth');

const router = express.Router();

// Validation middleware
const validatePaint = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Paint name must be between 2 and 100 characters'),
  body('shadeCode')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Shade code is required and must not exceed 20 characters'),
  body('hexValue')
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Hex value must be a valid hex color code (e.g., #FF0000 or #F00)'),
  body('brand')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Brand is required and must not exceed 50 characters'),
  body('colorFamily')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Color family is required and must not exceed 50 characters'),
  body('finish')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Finish is required and must not exceed 50 characters'),
  body('categoryId')
    .isMongoId()
    .withMessage('Valid category ID is required'),
  body('availableSizes')
    .isArray({ min: 1 })
    .withMessage('At least one size must be provided'),
  body('availableSizes.*.size')
    .isLength({ min: 1 })
    .withMessage('Size is required'),
  body('availableSizes.*.price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters')
];

// Get all paints with pagination and search
router.get('/', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      brand = '',
      colorFamily = '',
      categoryId = '',
      sortBy = 'name',
      sortOrder = 'asc' 
    } = req.query;

    const skip = (page - 1) * limit;
    const query = {};

    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shadeCode: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { colorFamily: { $regex: search, $options: 'i' } }
      ];
    }

    // Add filters
    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }

    if (colorFamily) {
      query.colorFamily = { $regex: colorFamily, $options: 'i' };
    }

    if (categoryId) {
      query.categoryId = categoryId;
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [paints, totalPaints] = await Promise.all([
      Paint.find(query)
        .populate('categoryId', 'name type')
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Paint.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        paints,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalPaints / limit),
          totalItems: totalPaints,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get paints error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch paints' 
    });
  }
});

// Get single paint by ID
router.get('/:id', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const paint = await Paint.findById(req.params.id)
      .populate('categoryId', 'name type');
    
    if (!paint) {
      return res.status(404).json({ 
        success: false, 
        error: 'Paint not found' 
      });
    }

    res.json({
      success: true,
      data: paint
    });
  } catch (error) {
    console.error('Get paint error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch paint' 
    });
  }
});

// Create new paint
router.post('/', authenticateUser, authorizeAdmin, validatePaint, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      name,
      shadeCode,
      hexValue,
      brand,
      colorFamily,
      finish,
      categoryId,
      availableSizes,
      description,
      image
    } = req.body;

    // Verify category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Check if paint with same shade code already exists
    const existingPaint = await Paint.findOne({ shadeCode });
    if (existingPaint) {
      return res.status(400).json({
        success: false,
        error: 'Paint with this shade code already exists'
      });
    }

    const paint = new Paint({
      name,
      shadeCode,
      hexValue,
      brand,
      colorFamily,
      finish,
      categoryId,
      availableSizes,
      description,
      image
    });

    await paint.save();

    // Populate category info before sending response
    await paint.populate('categoryId', 'name type');

    res.status(201).json({
      success: true,
      message: 'Paint created successfully',
      data: paint
    });
  } catch (error) {
    console.error('Create paint error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create paint' 
    });
  }
});

// Update paint
router.put('/:id', authenticateUser, authorizeAdmin, validatePaint, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      name,
      shadeCode,
      hexValue,
      brand,
      colorFamily,
      finish,
      categoryId,
      availableSizes,
      description,
      image,
      isActive
    } = req.body;

    // Verify category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Check if another paint with same shade code exists
    const existingPaint = await Paint.findOne({ 
      shadeCode, 
      _id: { $ne: req.params.id } 
    });
    
    if (existingPaint) {
      return res.status(400).json({
        success: false,
        error: 'Paint with this shade code already exists'
      });
    }

    const paint = await Paint.findByIdAndUpdate(
      req.params.id,
      {
        name,
        shadeCode,
        hexValue,
        brand,
        colorFamily,
        finish,
        categoryId,
        availableSizes,
        description,
        image,
        isActive
      },
      { new: true, runValidators: true }
    ).populate('categoryId', 'name type');

    if (!paint) {
      return res.status(404).json({ 
        success: false, 
        error: 'Paint not found' 
      });
    }

    res.json({
      success: true,
      message: 'Paint updated successfully',
      data: paint
    });
  } catch (error) {
    console.error('Update paint error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update paint' 
    });
  }
});

// Delete paint
router.delete('/:id', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const paint = await Paint.findById(req.params.id);
    
    if (!paint) {
      return res.status(404).json({ 
        success: false, 
        error: 'Paint not found' 
      });
    }

    await Paint.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Paint deleted successfully'
    });
  } catch (error) {
    console.error('Delete paint error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete paint' 
    });
  }
});

// Get paint brands (for filters)
router.get('/brands/list', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const brands = await Paint.distinct('brand');
    
    res.json({
      success: true,
      data: brands.sort()
    });
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch brands' 
    });
  }
});

// Get color families (for filters)
router.get('/color-families/list', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const colorFamilies = await Paint.distinct('colorFamily');
    
    res.json({
      success: true,
      data: colorFamilies.sort()
    });
  } catch (error) {
    console.error('Get color families error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch color families' 
    });
  }
});

// Bulk update paints
router.patch('/bulk-update', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { ids, updates } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid paint IDs array is required'
      });
    }

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Updates object is required'
      });
    }

    const result = await Paint.updateMany(
      { _id: { $in: ids } },
      { $set: updates }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} paints updated successfully`,
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update paints' 
    });
  }
});

module.exports = router;
