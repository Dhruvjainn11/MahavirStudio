const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../../models/Product');
const Category = require('../../models/Category');
const Paint = require('../../models/Paint');
const { authenticateUser, authorizeAdmin } = require('../../middleware/auth');

const router = express.Router();

// Validation middleware
const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('categoryId')
    .isMongoId()
    .withMessage('Valid category ID is required'),
  body('subcategoryId')
    .optional()
    .isMongoId()
    .withMessage('Subcategory ID must be valid if provided'),
  body('type')
    .isIn(['hardware', 'paint'])
    .withMessage('Type must be either hardware or paint'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('brand')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Brand must not exceed 50 characters'),
  body('model')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Model must not exceed 50 characters'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  body('images.*.url')
    .optional()
    .isURL()
    .withMessage('Image URL must be valid'),
  body('availableColors')
    .optional()
    .isArray()
    .withMessage('Available colors must be an array'),
  body('availableColors.*')
    .optional()
    .isMongoId()
    .withMessage('Available colors must contain valid paint IDs'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

// Get all products with pagination and search
router.get('/', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      type = '',
      categoryId = '',
      subcategoryId = '',
      brand = '',
      inStock = '',
      sortBy = 'name',
      sortOrder = 'asc' 
    } = req.query;

    const skip = (page - 1) * limit;
    const query = {};

    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } }
      ];
    }

    // Add filters
    if (type) {
      query.type = type;
    }

    if (categoryId) {
      query.categoryId = categoryId;
    }

    if (subcategoryId) {
      query.subcategoryId = subcategoryId;
    }

    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }

    if (inStock !== '') {
      query.stock = inStock === 'true' ? { $gt: 0 } : { $eq: 0 };
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [products, totalProducts] = await Promise.all([
      Product.find(query)
        .populate('categoryId', 'name type')
        .populate('availableColors', 'name shadeCode hexValue brand')
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalProducts / limit),
          totalItems: totalProducts,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch products' 
    });
  }
});

// Get single product by ID
router.get('/:id', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categoryId', 'name type subcategories')
      .populate('availableColors', 'name shadeCode hexValue brand');
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: 'Product not found' 
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch product' 
    });
  }
});

// Create new product
router.post('/', authenticateUser, authorizeAdmin, validateProduct, async (req, res) => {
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
      description,
      price,
      images,
      categoryId,
      subcategoryId,
      availableColors,
      type,
      stock,
      tags,
      brand,
      model,
      specifications
    } = req.body;

    // Verify category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Verify subcategory exists if provided
    if (subcategoryId) {
      const subcategory = category.subcategories.id(subcategoryId);
      if (!subcategory) {
        return res.status(400).json({
          success: false,
          error: 'Subcategory not found'
        });
      }
    }

    // Verify available colors exist if provided
    if (availableColors && availableColors.length > 0) {
      const paintCount = await Paint.countDocuments({ 
        _id: { $in: availableColors } 
      });
      if (paintCount !== availableColors.length) {
        return res.status(400).json({
          success: false,
          error: 'Some paint colors do not exist'
        });
      }
    }

    const product = new Product({
      name,
      description,
      price,
      images,
      categoryId,
      subcategoryId,
      availableColors,
      type,
      stock,
      tags,
      brand,
      model,
      specifications
    });

    await product.save();

    // Populate references before sending response
    await product.populate([
      { path: 'categoryId', select: 'name type' },
      { path: 'availableColors', select: 'name shadeCode hexValue brand' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create product' 
    });
  }
});

// Update product
router.put('/:id', authenticateUser, authorizeAdmin, validateProduct, async (req, res) => {
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
      description,
      price,
      images,
      categoryId,
      subcategoryId,
      availableColors,
      type,
      stock,
      tags,
      brand,
      model,
      specifications,
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

    // Verify subcategory exists if provided
    if (subcategoryId) {
      const subcategory = category.subcategories.id(subcategoryId);
      if (!subcategory) {
        return res.status(400).json({
          success: false,
          error: 'Subcategory not found'
        });
      }
    }

    // Verify available colors exist if provided
    if (availableColors && availableColors.length > 0) {
      const paintCount = await Paint.countDocuments({ 
        _id: { $in: availableColors } 
      });
      if (paintCount !== availableColors.length) {
        return res.status(400).json({
          success: false,
          error: 'Some paint colors do not exist'
        });
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        images,
        categoryId,
        subcategoryId,
        availableColors,
        type,
        stock,
        tags,
        brand,
        model,
        specifications,
        isActive
      },
      { new: true, runValidators: true }
    ).populate([
      { path: 'categoryId', select: 'name type' },
      { path: 'availableColors', select: 'name shadeCode hexValue brand' }
    ]);

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: 'Product not found' 
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update product' 
    });
  }
});

// Delete product
router.delete('/:id', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: 'Product not found' 
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete product' 
    });
  }
});

// Get product brands (for filters)
router.get('/brands/list', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    
    res.json({
      success: true,
      data: brands.filter(brand => brand).sort()
    });
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch brands' 
    });
  }
});

// Update product stock
router.patch('/:id/stock', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { stock } = req.body;
    
    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({
        success: false,
        error: 'Stock must be a non-negative number'
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    ).populate('categoryId', 'name type');

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: 'Product not found' 
      });
    }

    res.json({
      success: true,
      message: 'Product stock updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update product stock' 
    });
  }
});

// Bulk update products
router.patch('/bulk-update', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { ids, updates } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid product IDs array is required'
      });
    }

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Updates object is required'
      });
    }

    const result = await Product.updateMany(
      { _id: { $in: ids } },
      { $set: updates }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} products updated successfully`,
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update products' 
    });
  }
});

// Get low stock products
router.get('/inventory/low-stock', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { threshold = 10 } = req.query;
    
    const lowStockProducts = await Product.find({
      stock: { $lte: parseInt(threshold) },
      isActive: true
    })
      .populate('categoryId', 'name type')
      .sort({ stock: 1 })
      .limit(50);

    res.json({
      success: true,
      data: lowStockProducts
    });
  } catch (error) {
    console.error('Get low stock products error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch low stock products' 
    });
  }
});

// Bulk import products
// Update your bulk import route to include better validation
router.post('/bulk-import', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products)){
      return res.status(400).json({
        success: false,
        error: 'Products must be an array'
      });
    }

    if (products.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No products to import'
      });
    }

    if (products.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Cannot import more than 1000 products at once'
      });
    }

    // Validate each product
    const validatedProducts = [];
    const errors = [];

    for (const [index, product] of products.entries()) {
      try {
        // Basic validation
        if (!product.name || !product.price || !product.categoryId) {
          throw new Error('Missing required fields');
        }

        // Verify category exists
        const category = await Category.findById(product.categoryId);
        if (!category) {
          throw new Error('Category not found');
        }

        validatedProducts.push({
          name: product.name,
          description: product.description || '',
          price: Number(product.price) || 0,
          stock: Number(product.stock) || 0,
          type: ['hardware', 'paint'].includes(product.type) ? product.type : 'hardware',
          categoryId: product.categoryId,
          brand: product.brand || '',
          model: product.model || '',
          images: Array.isArray(product.images) ? product.images : [],
          isActive: product.isActive !== undefined ? Boolean(product.isActive) : true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      } catch (err) {
        errors.push({
          index,
          error: err.message,
          product: product.name || 'Unnamed product'
        });
      }
    }

    if (errors.length > 0 && errors.length === products.length) {
      return res.status(400).json({
        success: false,
        error: 'All products failed validation',
        details: errors
      });
    }

    // Insert valid products
    const result = await Product.insertMany(validatedProducts, { ordered: false });

    res.status(201).json({
      success: true,
      message: `Successfully imported ${result.length} products`,
      importedCount: result.length,
      errorCount: errors.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to import products',
      details: error.message
    });
  }
});
module.exports = router;
