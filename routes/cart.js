const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const {authenticateUser} = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', authenticateUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id })
      .populate('items.productId', 'name price images type brand');

    if (!cart) {
      return res.status(200).json({ items: [], totalItems: 0 });
    }

    // Filter out items with null productId (in case product was deleted)
    const validItems = cart.items.filter(item => item.productId);
    
    if (validItems.length !== cart.items.length) {
      // Update cart to remove invalid items
      cart.items = validItems;
      await cart.save();
    }

    res.status(200).json({
      items: cart.items,
      totalItems: cart.totalItems
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Failed to fetch cart', error: error.message });
  }
});

// Add item to cart
router.post('/', authenticateUser, async (req, res) => {
  const { productId, quantity = 1 } = req.body;

   // --- ADD THESE LOGS ---
  console.log('\n--- Cart Route: Inspecting req.user ---');
  console.log('req.user:', req.user); // Log the entire req.user object
  console.log('req.user?._id:', req.user?._id); // Safely log the _id
  console.log('req.user type:', typeof req.user);
  if (req.user && typeof req.user._id === 'object' && req.user._id !== null) {
      console.log('req.user._id is an ObjectId:', req.user._id.constructor.name === 'ObjectID' || req.user._id.constructor.name === 'ObjectId');
  }
  console.log('--- End Cart Route Inspection ---');
  // --- END ADDED LOGS ---
  
  try {
    // Validate input
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    
    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    // Validate product exists and is active
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (!product.isActive) {
      return res.status(400).json({ message: 'Product is not available' });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      // Create new cart if it doesn't exist
      cart = new Cart({
        userId: req.user._id,
        items: [{ productId, quantity }]
      });
    } else {
      // Check if product already exists in cart (FIXED: use productId not _id)
      const existingItemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId.toString()
      );

      if (existingItemIndex >= 0) {
        // Update quantity if product exists
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item if product doesn't exist
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();

    // Populate cart for response
    await cart.populate('items.productId', 'name price images type brand');
    
    // Find the updated/added item
    const addedItem = cart.items.find(
      item => item.productId._id.toString() === productId.toString()
    );

    res.status(200).json({
      message: 'Item added to cart successfully',
      addedItem,
      totalItems: cart.totalItems,
      cart: {
        items: cart.items,
        totalItems: cart.totalItems
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Failed to add item to cart', error: error.message });
  }
});

// Update item quantity
router.put('/:productId', authenticateUser, async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  try {
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    const oldQuantity = cart.items[itemIndex].quantity;
    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    // Populate for response
    await cart.populate('items.productId', 'name price images type brand');

    res.status(200).json({
      message: 'Quantity updated successfully',
      updatedItem: cart.items[itemIndex],
      totalItems: cart.totalItems,
      quantityChange: quantity - oldQuantity
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ message: 'Failed to update quantity', error: error.message });
  }
});

// Remove item from cart
router.delete('/:productId', authenticateUser, async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    await cart.save();

    res.status(200).json({
      message: 'Item removed from cart',
      totalItems: cart.totalItems
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove item', error: error.message });
  }
});

// Clear cart
router.delete('/', authenticateUser,  async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      message: 'Cart cleared',
      totalItems: 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear cart', error: error.message });
  }
});

module.exports = router;