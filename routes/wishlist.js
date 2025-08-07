// routes/wishlist.js
const express = require('express');
const Wishlist = require('../models/Wishlist'); // Use CommonJS require
const Product = require('../models/Product');   // Use CommonJS require
const {authenticateUser} = require('../middleware/auth'); // Your actual authentication middleware

const router = express.Router();

/**
 * All routes below will use the authenticateUser middleware.
 * Ensure your authenticateUser middleware sets req.user with the user's ID.
 */

/**
 * @route GET /api/wishlist
 * @desc Get user's wishlist
 * @access Private
 */
router.get('/', authenticateUser, async (req, res) => {
  try {
    // req.user.id should be available from the authenticateUser middleware
    const userId = req.user.id; 

    // Populate product details for each item in the wishlist
    const wishlist = await Wishlist.findOne({ userId }).populate('items.productId');
    
    if (!wishlist) {
      // If no wishlist found for the user, return an empty array of items
      // This is a cleaner response than a 404 for an empty state.
      return res.status(200).json({ items: [] }); 
    }
    res.json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

/**
 * @route POST /api/wishlist
 * @desc Add item to wishlist
 * @access Private
 */
router.post('/', authenticateUser, async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  try {
    // 1. Validate Product Existence
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // 2. Find or Create Wishlist
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      // Create new wishlist if it doesn't exist for this user
      wishlist = new Wishlist({ userId, items: [] });
    }

    // 3. Check if item already exists in wishlist
    const itemExists = wishlist.items.some(
      (item) => item.productId.toString() === productId
    );

    if (itemExists) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    // 4. Add new item
    wishlist.items.push({ productId, addedAt: new Date() });
    await wishlist.save();
    
    // 5. Populate and Send Response
    // Populate to send back full product details for the updated wishlist
    await wishlist.populate('items.productId');
    res.status(201).json(wishlist);
  } catch (error) {
    console.error('Error adding item to wishlist:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

/**
 * @route DELETE /api/wishlist/:itemId
 * @desc Remove item from wishlist
 * @access Private
 * @param itemId - The _id of the specific item document within the 'items' array.
 */
router.delete('/:itemId', authenticateUser, async (req, res) => {
  const { itemId } = req.params; // itemId is the _id of the subdocument (item) in the wishlist's items array
  const userId = req.user.id;

  try {
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found for this user' });
    }

    // Filter out the item to be removed
    const initialLength = wishlist.items.length;
    wishlist.items = wishlist.items.filter(item => item._id.toString() !== itemId);

    if (wishlist.items.length === initialLength) {
      // If length is unchanged, it means the item was not found
      return res.status(404).json({ message: 'Item not found in wishlist' });
    }

    await wishlist.save();
    
    // Populate and Send Response
    await wishlist.populate('items.productId');
    res.json(wishlist);
  } catch (error) {
    console.error('Error removing item from wishlist:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

module.exports = router; // Use CommonJS export