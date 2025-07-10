const express = require('express');
const Category = require('../models/Category');
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');
const { validateCategory } = require('../middleware/validation');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('subcategories', 'name description isActive');

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error while fetching categories' });
  }
});

// Get single category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('subcategories', 'name description isActive');

    if (!category || !category.isActive) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Server error while fetching category' });
  }
});

// Create new category (Admin only)
router.post('/', authenticateUser, authorizeAdmin, validateCategory, async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();

    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Server error while creating category' });
  }
});

// Update category (Admin only)
router.put('/:id', authenticateUser, authorizeAdmin, validateCategory, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Server error while updating category' });
  }
});

// Soft delete category (Admin only)
router.delete('/:id', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Server error while deleting category' });
  }
});

// Add subcategory (Admin only)
router.post('/:id/subcategories', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category || !category.isActive) {
      return res.status(404).json({ error: 'Category not found' });
    }

    category.subcategories.push({ name, description });
    await category.save();

    res.status(201).json({ message: 'Subcategory added successfully', category });
  } catch (error) {
    console.error('Add subcategory error:', error);
    res.status(500).json({ error: 'Server error while adding subcategory' });
  }
});

// Update subcategory (Admin only)
router.put('/:categoryId/subcategories/:subCategoryId', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await Category.findById(req.params.categoryId);

    if (!category || !category.isActive) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const subcategory = category.subcategories.id(req.params.subCategoryId);

    if (!subcategory || !subcategory.isActive) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }

    subcategory.name = name || subcategory.name;
    subcategory.description = description || subcategory.description;
    await category.save();

    res.json({ message: 'Subcategory updated successfully', category });
  } catch (error) {
    console.error('Update subcategory error:', error);
    res.status(500).json({ error: 'Server error while updating subcategory' });
  }
});

// Soft delete subcategory (Admin only)
router.delete('/:categoryId/subcategories/:subCategoryId', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);

    if (!category || !category.isActive) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const subcategory = category.subcategories.id(req.params.subCategoryId);

    if (!subcategory || !subcategory.isActive) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }

    subcategory.isActive = false;
    await category.save();

    res.json({ message: 'Subcategory deleted successfully', category });
  } catch (error) {
    console.error('Delete subcategory error:', error);
    res.status(500).json({ error: 'Server error while deleting subcategory' });
  }
});

module.exports = router;

