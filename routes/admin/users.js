const express = require('express');
const User = require('../../models/User');
const Order = require('../../models/Order');
const { authenticateUser, authorizeAdmin } = require('../../middleware/auth');

const router = express.Router();

// Get all users with pagination and search
router.get('/', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      isActive = '',
      sortBy = 'createdAt',
      sortOrder = 'desc' 
    } = req.query;

    const skip = (page - 1) * limit;
    const query = { isAdmin: false }; // Exclude admin users

    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Add active filter
    if (isActive !== '') {
      query.isActive = isActive === 'true';
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [users, totalUsers] = await Promise.all([
      User.find(query)
        .select('-password') // Exclude password field
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      User.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / limit),
          totalItems: totalUsers,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch users' 
    });
  }
});

// Get single user by ID with order history
router.get('/:id', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password'); // Exclude password field
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    // Get user's order history
    const orders = await Order.find({ userId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('_id totalAmount status paymentStatus createdAt items')
      .lean();

    // Calculate user statistics
    const [
      totalOrders,
      totalSpent,
      averageOrderValue
    ] = await Promise.all([
      Order.countDocuments({ userId: req.params.id }),
      Order.aggregate([
        { 
          $match: { 
            userId: user._id,
            status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
          } 
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.aggregate([
        { 
          $match: { 
            userId: user._id,
            status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
          } 
        },
        { $group: { _id: null, average: { $avg: '$totalAmount' } } }
      ])
    ]);

    const userWithStats = {
      ...user.toObject(),
      statistics: {
        totalOrders,
        totalSpent: totalSpent[0]?.total || 0,
        averageOrderValue: averageOrderValue[0]?.average || 0
      },
      recentOrders: orders
    };

    res.json({
      success: true,
      data: userWithStats
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch user' 
    });
  }
});

// Get user orders
router.get('/:id/orders', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    const [orders, totalOrders] = await Promise.all([
      Order.find({ userId: req.params.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Order.countDocuments({ userId: req.params.id })
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
    console.error('Get user orders error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch user orders' 
    });
  }
});

// Toggle user active status
router.patch('/:id/toggle-status', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    if (user.isAdmin) {
      return res.status(400).json({
        success: false,
        error: 'Cannot modify admin user status'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update user status' 
    });
  }
});

// Get user statistics overview
router.get('/statistics/overview', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const [
      totalUsers,
      activeUsers,
      newUsersToday,
      newUsersThisMonth,
      newUsersThisYear,
      emailVerifiedUsers,
      usersWithOrders
    ] = await Promise.all([
      User.countDocuments({ isAdmin: false }),
      User.countDocuments({ isAdmin: false, isActive: true }),
      User.countDocuments({ 
        isAdmin: false, 
        createdAt: { $gte: startOfDay } 
      }),
      User.countDocuments({ 
        isAdmin: false, 
        createdAt: { $gte: startOfMonth } 
      }),
      User.countDocuments({ 
        isAdmin: false, 
        createdAt: { $gte: startOfYear } 
      }),
      User.countDocuments({ 
        isAdmin: false, 
        emailVerified: true 
      }),
      User.aggregate([
        { $match: { isAdmin: false } },
        {
          $lookup: {
            from: 'orders',
            localField: '_id',
            foreignField: 'userId',
            as: 'orders'
          }
        },
        {
          $match: {
            'orders.0': { $exists: true }
          }
        },
        {
          $count: 'usersWithOrders'
        }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        newUsersToday,
        newUsersThisMonth,
        newUsersThisYear,
        emailVerifiedUsers,
        usersWithOrders: usersWithOrders[0]?.usersWithOrders || 0,
        verificationRate: totalUsers > 0 ? ((emailVerifiedUsers / totalUsers) * 100).toFixed(1) : 0,
        conversionRate: totalUsers > 0 ? (((usersWithOrders[0]?.usersWithOrders || 0) / totalUsers) * 100).toFixed(1) : 0
      }
    });
  } catch (error) {
    console.error('Get user statistics error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch user statistics' 
    });
  }
});

// Get top customers
router.get('/analytics/top-customers', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topCustomers = await Order.aggregate([
      {
        $match: {
          status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
        }
      },
      {
        $group: {
          _id: '$userId',
          totalSpent: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$totalAmount' },
          lastOrderDate: { $max: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $match: {
          'user.isAdmin': false
        }
      },
      {
        $project: {
          _id: 1,
          totalSpent: 1,
          totalOrders: 1,
          averageOrderValue: 1,
          lastOrderDate: 1,
          name: '$user.name',
          email: '$user.email',
          phone: '$user.phone'
        }
      },
      {
        $sort: { totalSpent: -1 }
      },
      {
        $limit: parseInt(limit)
      }
    ]);

    res.json({
      success: true,
      data: topCustomers
    });
  } catch (error) {
    console.error('Get top customers error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch top customers' 
    });
  }
});

// Get user registration trends
router.get('/analytics/registration-trends', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    
    let groupBy;
    let dateRange = new Date();
    
    switch (period) {
      case 'daily':
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        dateRange.setDate(dateRange.getDate() - 30);
        break;
      case 'weekly':
        groupBy = {
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' }
        };
        dateRange.setDate(dateRange.getDate() - 90);
        break;
      case 'monthly':
      default:
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
        dateRange.setMonth(dateRange.getMonth() - 12);
        break;
    }

    const registrationData = await User.aggregate([
      {
        $match: {
          isAdmin: false,
          createdAt: { $gte: dateRange }
        }
      },
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        period,
        registrationData
      }
    });
  } catch (error) {
    console.error('Get registration trends error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch registration trends' 
    });
  }
});

// Export users data
router.get('/export/csv', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { 
      isActive = '', 
      emailVerified = '',
      startDate = '',
      endDate = ''
    } = req.query;

    const query = { isAdmin: false };

    // Add filters
    if (isActive !== '') {
      query.isActive = isActive === 'true';
    }

    if (emailVerified !== '') {
      query.emailVerified = emailVerified === 'true';
    }

    // Add date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    // Convert to CSV-friendly format
    const csvData = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || 'N/A',
      isActive: user.isActive ? 'Active' : 'Inactive',
      emailVerified: user.emailVerified ? 'Verified' : 'Not Verified',
      lastLogin: user.lastLogin || 'Never',
      registrationDate: user.createdAt,
      addressCount: user.addresses?.length || 0
    }));

    res.json({
      success: true,
      data: csvData
    });
  } catch (error) {
    console.error('Export users error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to export users' 
    });
  }
});

module.exports = router;
