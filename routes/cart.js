const express = require('express');
const Cart = require('../models/Cart');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', authenticateUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Server error while fetching cart' });
  }
});

// Add item to cart
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(201).json({ message: 'Item added to cart', cart });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Server error while adding to cart' });
  }
});

// Update item quantity in cart
router.put('/', authenticateUser, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      res.json({ message: 'Cart updated successfully', cart });
    } else {
      return res.status(404).json({ error: 'Item not found in cart' });
    }
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Server error while updating cart' });
  }
});

// Remove item from cart
router.delete('/', authenticateUser, async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      await cart.save();
      res.json({ message: 'Item removed from cart', cart });
    } else {
      return res.status(404).json({ error: 'Item not found in cart' });
    }
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Server error while removing from cart' });
  }
});

// Clear cart
router.delete('/clear', authenticateUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();
    res.json({ message: 'Cart cleared successfully', cart });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Server error while clearing cart' });
  }
});

module.exports = router;

