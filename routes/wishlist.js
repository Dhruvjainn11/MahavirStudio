const express = require('express');
const Wishlist = require('../models/Wishlist');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Get user's wishlist
router.get('/', authenticateUser, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id })
      .populate('productIds', 'name price images rating');
    
    if (!wishlist) {
      return res.json({ productIds: [] });
    }
    
    res.json(wishlist);
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ error: 'Server error while fetching wishlist' });
  }
});

// Add item to wishlist
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    let wishlist = await Wishlist.findOne({ userId: req.user._id });
    
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user._id, productIds: [] });
    }

    // Check if product already exists in wishlist
    if (wishlist.productIds.includes(productId)) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }

    wishlist.productIds.push(productId);
    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id)
      .populate('productIds', 'name price images rating');

    res.status(201).json({
      message: 'Product added to wishlist',
      wishlist: populatedWishlist
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ error: 'Server error while adding to wishlist' });
  }
});

// Remove item from wishlist
router.delete('/', authenticateUser, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const wishlist = await Wishlist.findOne({ userId: req.user._id });
    
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    const productIndex = wishlist.productIds.indexOf(productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found in wishlist' });
    }

    wishlist.productIds.splice(productIndex, 1);
    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id)
      .populate('productIds', 'name price images rating');

    res.json({
      message: 'Product removed from wishlist',
      wishlist: populatedWishlist
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ error: 'Server error while removing from wishlist' });
  }
});

// Clear wishlist
router.delete('/clear', authenticateUser, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id });
    
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    wishlist.productIds = [];
    await wishlist.save();

    res.json({
      message: 'Wishlist cleared successfully',
      wishlist
    });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({ error: 'Server error while clearing wishlist' });
  }
});

// Check if product is in wishlist
router.get('/check/:productId', authenticateUser, async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ userId: req.user._id });
    
    if (!wishlist) {
      return res.json({ inWishlist: false });
    }

    const inWishlist = wishlist.productIds.includes(productId);
    res.json({ inWishlist });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({ error: 'Server error while checking wishlist' });
  }
});

module.exports = router;
