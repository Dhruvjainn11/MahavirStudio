const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const { authenticateUser, authorizeAdmin, authorizeUserOrAdmin } = require('../middleware/auth');
const { validateOrder } = require('../middleware/validation');

const router = express.Router();

// Get all orders (Admin only)
router.get('/', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, userId } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (userId) filter.userId = userId;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(filter)
      .populate('userId', 'name email')
      .populate('items.productId', 'name images price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Server error while fetching orders' });
  }
});

// Get user's orders
router.get('/user/:userId', authenticateUser, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = { userId: req.params.userId };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(filter)
      .populate({
        path: 'items.productId',
        select: 'name images price slug', // Include more fields if needed
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders: orders.map(order => ({
        ...order.toObject(),
        totalAmount: order.totalAmount.toFixed(2), // Format currency
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while fetching user orders' 
    });
  }
});


// Create new order
// At the top of your router.post route, after destructuring req.body
router.post('/', authenticateUser, validateOrder, async (req, res) => {
  // Destructure all relevant fields from req.body
  const { 
      billingDetails, 
      paymentMethod, 
      paymentInfo, // Contains payment gateway response (e.g., status)
      items: incomingItems, 
      totalAmount, 
      subtotal, 
      shippingCost, 
      taxAmount, 
      discountAmount, 
      shippingDetails 
  } = req.body;

  try {
      // Step 1: Check product stock and build order items array
      let orderItems = [];
      for (let item of incomingItems) {
          const product = await Product.findById(item._id);
          if (!product) {
              return res.status(404).json({ message: `Product not found: ${item._id}` });
          }
          if (product.stock < item.quantity) {
              return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
          }
          orderItems.push({
              productId: product._id,
              name: product.name,
              image: product.images[0]?.url,
              price: product.price,
              quantity: item.quantity,
          });
          // Decrement stock immediately to prevent overselling
          product.stock -= item.quantity;
          await product.save();
      }

      // Step 2: Format billing and shipping details
      const formattedBillingDetails = {
          name: billingDetails.fullname,
          email: billingDetails.email,
          phone: billingDetails.phone,
          address: {
              street: billingDetails.address,
              city: billingDetails.city,
              state: billingDetails.state,
              zipCode: billingDetails.pincode,
              country: billingDetails.country || 'India'
          }
      };

      const finalShippingAddress = {
          street: shippingDetails?.address || billingDetails.address,
          city: shippingDetails?.city || billingDetails.city,
          state: shippingDetails?.state || billingDetails.state,
          zipCode: shippingDetails?.pincode || billingDetails.pincode,
          country: shippingDetails?.country || 'India'
      };

      // Step 3: Determine payment and order status
      // For now, this is a mock. In a real scenario, this would come from the paymentInfo object
      // received from your payment gateway's webhook or success response.
      const actualPaymentStatus = paymentInfo?.status || 'pending';
      const orderStatus = actualPaymentStatus === 'paid' ? 'processing' : 'pending';

      // Step 4: Create and save the new order
      const order = new Order({
          userId: req.user._id,
          billingDetails: formattedBillingDetails,
          shippingAddress: finalShippingAddress,
          items: orderItems,
          totalAmount,
          paymentMethod,
          paymentInfo, // Pass the entire paymentInfo object
          taxAmount,
          shippingCost,
          discountAmount,
          status: orderStatus, // Assign the fulfillment status
          paymentStatus: actualPaymentStatus, // Assign the payment status
          paidAt: actualPaymentStatus === 'paid' ? Date.now() : null,
      });

      const createdOrder = await order.save();

      // Step 5: Send a successful response
      res.status(201).json({
          message: 'Order placed successfully!',
          orderId: createdOrder._id,
          redirectUrl: '/order-confirmation?orderId=' + createdOrder._id
      });

  } catch (error) {
      console.error("Order placement error:", error);
      // Add specific validation error handling if needed
      if (error.name === 'ValidationError') {
          return res.status(400).json({ message: error.message, errors: error.errors });
      }
      res.status(500).json({ message: 'Server Error', details: error.message });
  }
});

// NEW ROUTE TO ADD: GET Order by ID
// GET /api/orders/:orderId
router.get('/:orderId', authenticateUser, async (req, res) => {
    try {
        const orderId = req.params.orderId;

        // Validate if orderId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: 'Invalid order ID format.' });
        }

        // Find the order by ID and ensure it belongs to the authenticated user
        const order = await Order.findOne({ _id: orderId, userId: req.user._id })
                                  .populate('userId', 'name email') // Populate user details
                                  .populate({
                                      path: 'items.productId', // Populate product details within the items array
                                      select: 'name images price' // Select specific fields to return
                                  });

      console.log(order)

        if (!order) {
            return res.status(404).json({ message: 'Order not found or you do not have permission to view it.' });
        }

        res.status(200).json({ order });

    } catch (error) {
        console.error("Error fetching order details:", error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});

// Update order status (Admin only)
router.patch('/:id/status', authenticateUser, async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'name email')
     .populate('items.productId', 'name images price');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Server error while updating order status' });
  }
});

// Cancel order
router.patch('/:id/cancel', authenticateUser, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns this order or is admin
    if (!req.user.isAdmin && req.user._id.toString() !== order.userId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Can only cancel pending or confirmed orders
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ error: 'Order cannot be cancelled' });
    }

    order.status = 'cancelled';
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } }
      );
    }

    res.json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Server error while cancelling order' });
  }
});

// Update payment status (Admin only)
router.patch('/:id/payment', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ error: 'Invalid payment status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    ).populate('userId', 'name email')
     .populate('items.productId', 'name images price');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      message: 'Payment status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ error: 'Server error while updating payment status' });
  }
});

// Add tracking number (Admin only)
router.patch('/:id/tracking', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { trackingNumber } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { trackingNumber },
      { new: true }
    ).populate('userId', 'name email')
     .populate('items.productId', 'name images price');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      message: 'Tracking number updated successfully',
      order
    });
  } catch (error) {
    console.error('Update tracking number error:', error);
    res.status(500).json({ error: 'Server error while updating tracking number' });
  }
});

// Get order statistics (Admin only)
router.get('/stats/overview', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      stats,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ error: 'Server error while fetching order statistics' });
  }
});

module.exports = router;
