const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../../models/Order');
const User = require('../../models/User');
const { authenticateUser, authorizeAdmin } = require('../../middleware/auth');
const generateInvoicePDF = require('../../utils/generateInvoicePDF');


const router = express.Router();

// Validation middleware
const validateOrderStatus = [
  body('status')
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status')
];

const validateDateRange = [
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO8601 date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO8601 date')
];

router.get('/test', (req, res) => {
  res.send('Orders route is working!');
});


// Create a new order (for testing via Postman)
router.post('/', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const {
      userId,
      items,
      shippingAddress,
      totalAmount,
      status = 'pending',
      paymentStatus = 'pending',
      notes = '',
      trackingNumber = '',
      estimatedDelivery = null
    } = req.body;

    if (!userId || !items || items.length === 0 || !shippingAddress || !totalAmount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, items, shippingAddress, totalAmount',
      });
    }

    const order = await Order.create({
      userId,
      items,
      shippingAddress,
      totalAmount,
      status,
      paymentStatus,
      notes,
      trackingNumber,
      estimatedDelivery,
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order',
    });
  }
});


// Get all orders with pagination and filters
router.get('/', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status, paymentStatus } = req.query;

    const skip = (page - 1) * limit;
    const query = {};

    if (search) {
      query.$or = [
        { 'userId.name': { $regex: search, $options: 'i' } },
        { 'userId.email': { $regex: search, $options: 'i' } }
      ];
    }

    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const [orders, totalOrders] = await Promise.all([
      Order.find(query)
        .populate('userId', 'name email') // only populate needed fields
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Order.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        orders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: parseInt(page)
      }
    });
  } catch (error) {
    console.error('Admin Orders Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders'
    });
  }
});


// Get single order by ID
router.get('/:id', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email phone addresses')
      .populate('items.productId', 'name images brand model');
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        error: 'Order not found' 
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch order' 
    });
  }
});

// Update order status
router.patch('/:id/status', authenticateUser, authorizeAdmin, validateOrderStatus, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { status, notes, trackingNumber, estimatedDelivery } = req.body;
    
    const updateData = { status };
    
    if (notes) updateData.notes = notes;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (estimatedDelivery) updateData.estimatedDelivery = new Date(estimatedDelivery);

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('userId', 'name email phone');

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        error: 'Order not found' 
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update order status' 
    });
  }
});

// Update payment status
router.patch('/:id/payment-status', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    
    if (!['pending', 'paid', 'failed', 'refunded'].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment status'
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    ).populate('userId', 'name email phone');

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        error: 'Order not found' 
      });
    }

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update payment status' 
    });
  }
});

// Get orders by status
router.get('/status/:status', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order status'
      });
    }

    const skip = (page - 1) * limit;

    const [orders, totalOrders] = await Promise.all([
      Order.find({ status })
        .populate('userId', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Order.countDocuments({ status })
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalOrders / limit),
          totalItems: totalOrders,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get orders by status error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch orders' 
    });
  }
});

// Get orders by date range
router.post('/date-range', authenticateUser, authorizeAdmin, validateDateRange, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { startDate, endDate, page = 1, limit = 10 } = req.body;
    const skip = (page - 1) * limit;

    const query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const [orders, totalOrders] = await Promise.all([
      Order.find(query)
        .populate('userId', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Order.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalOrders / limit),
          totalItems: totalOrders,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get orders by date range error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch orders' 
    });
  }
});

// Get order statistics
router.get('/statistics/overview', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const [
      totalOrders,
      todayOrders,
      monthlyOrders,
      yearlyOrders,
      statusBreakdown,
      paymentBreakdown,
      totalRevenue,
      monthlyRevenue
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startOfDay } }),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.countDocuments({ createdAt: { $gte: startOfYear } }),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { $group: { _id: '$paymentStatus', count: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { 
          $match: { 
            status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] } 
          } 
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.aggregate([
        { 
          $match: { 
            status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] },
            createdAt: { $gte: startOfMonth }
          } 
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        todayOrders,
        monthlyOrders,
        yearlyOrders,
        statusBreakdown: statusBreakdown.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        paymentBreakdown: paymentBreakdown.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Get order statistics error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch order statistics' 
    });
  }
});

// Bulk update orders
router.patch('/bulk-update', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { ids, updates } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid order IDs array is required'
      });
    }

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Updates object is required'
      });
    }

    // Validate status if provided
    if (updates.status && !['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].includes(updates.status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order status'
      });
    }

    const result = await Order.updateMany(
      { _id: { $in: ids } },
      { $set: updates }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} orders updated successfully`,
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update orders' 
    });
  }
});

// Export orders data
router.get('/export/csv', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      status = '', 
      paymentStatus = '' 
    } = req.query;

    const query = {};

    // Add filters
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    // Add date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .lean();

    // Convert to CSV-friendly format
    const csvData = orders.map(order => ({
      orderId: order._id,
      customerName: order.userId?.name || 'Unknown',
      customerEmail: order.userId?.email || 'N/A',
      customerPhone: order.userId?.phone || 'N/A',
      totalAmount: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      itemCount: order.items.length,
      createdAt: order.createdAt,
      trackingNumber: order.trackingNumber || 'N/A',
      notes: order.notes || 'N/A'
    }));

    res.json({
      success: true,
      data: csvData
    });
  } catch (error) {
    console.error('Export orders error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to export orders' 
    });
  }
});

// In your orders route file
router.get('/:id/invoice', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    // Generate PDF invoice (using pdfkit, puppeteer, or other library)
    const invoicePDF = await generateInvoicePDF(req.params.id);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice_${req.params.id}.pdf`);
    invoicePDF.pipe(res);
  } catch (error) {
    console.error('Invoice generation error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate invoice' });
  }
});

module.exports = router;
