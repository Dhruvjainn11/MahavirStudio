const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../../models/Category');
const { authenticateUser, authorizeAdmin } = require('../../middleware/auth');

const router = express.Router();

// Validation middleware
const validateCategory = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters'),
  body('type')
    .isIn(['hardware', 'paint'])
    .withMessage('Category type must be either hardware or paint'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  
];

const validateSubcategory = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Subcategory name must be between 2 and 50 characters'),
  body('description')
    .notEmpty()
    .withMessage('Subcategory description is required')
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('image')
    .optional()
    .isURL()
    .withMessage('Image must be a valid URL')
];

// Get all categories with pagination and search
router.get('/', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      type = '',
      sortBy = 'name',
      sortOrder = 'asc' 
    } = req.query;

    const skip = (page - 1) * limit;
    const query = {};

    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Add type filter
    if (type) {
      query.type = type;
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [categories, totalCategories] = await Promise.all([
      Category.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Category.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        categories,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCategories / limit),
          totalItems: totalCategories,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch categories' 
    });
  }
});

// Get single category by ID
router.get('/:id', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        error: 'Category not found' 
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch category' 
    });
  }
});

// Create new category
router.post('/', authenticateUser, authorizeAdmin, validateCategory, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { name, type, description } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ name, type });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        error: 'Category with this name already exists for this type'
      });
    }

    const category = new Category({
      name,
      type,
      description,
      subcategories: []
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create category' 
    });
  }
});

// Update category
router.put('/:id', authenticateUser, authorizeAdmin, validateCategory, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { name, type, description, image, isActive } = req.body;

    // Check if another category with same name exists
    const existingCategory = await Category.findOne({ 
      name, 
      type, 
      _id: { $ne: req.params.id } 
    });
    
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        error: 'Category with this name already exists for this type'
      });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, type, description, image, isActive },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ 
        success: false, 
        error: 'Category not found' 
      });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update category' 
    });
  }
});

// Delete category
router.delete('/:id', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        error: 'Category not found' 
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete category' 
    });
  }
});

// Add subcategory to category
router.post('/:id/subcategories', authenticateUser, authorizeAdmin, validateSubcategory, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { name, type, description } = req.body;
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        error: 'Category not found' 
      });
    }

    // Check if subcategory already exists
    const existingSubcategory = category.subcategories.find(
      sub => sub.name.toLowerCase() === name.toLowerCase()
    );

    if (existingSubcategory) {
      return res.status(400).json({
        success: false,
        error: 'Subcategory with this name already exists'
      });
    }

    const subcategory = {
      name,
      description,
      isActive: true
    };

    category.subcategories.push(subcategory);
    await category.save();

    res.status(201).json({
      success: true,
      message: 'Subcategory added successfully',
      data: category
    });
  } catch (error) {
    console.error('Add subcategory error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add subcategory' 
    });
  }
});

// Update subcategory
router.put('/:id/subcategories/:subId', authenticateUser, authorizeAdmin, validateSubcategory, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { name, description, image, isActive } = req.body;
    const { id: categoryId, subId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        error: 'Category not found' 
      });
    }

    const subcategory = category.subcategories.id(subId);
    if (!subcategory) {
      return res.status(404).json({ 
        success: false, 
        error: 'Subcategory not found' 
      });
    }

    // Check if another subcategory with same name exists
    const existingSubcategory = category.subcategories.find(
      sub => sub.name.toLowerCase() === name.toLowerCase() && 
              sub._id.toString() !== subId
    );

    if (existingSubcategory) {
      return res.status(400).json({
        success: false,
        error: 'Subcategory with this name already exists'
      });
    }

    subcategory.name = name;
    subcategory.description = description;
    subcategory.image = image;
    subcategory.isActive = isActive;

    await category.save();

    res.json({
      success: true,
      message: 'Subcategory updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Update subcategory error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update subcategory' 
    });
  }
});

// Delete subcategory
router.delete('/:id/subcategories/:subId', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { id: categoryId, subId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        error: 'Category not found' 
      });
    }

    const subcategory = category.subcategories.id(subId);
    if (!subcategory) {
      return res.status(404).json({ 
        success: false, 
        error: 'Subcategory not found' 
      });
    }

    category.subcategories.pull(subId);
    await category.save();

    res.json({
      success: true,
      message: 'Subcategory deleted successfully'
    });
  } catch (error) {
    console.error('Delete subcategory error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete subcategory' 
    });
  }
});

module.exports = router;
