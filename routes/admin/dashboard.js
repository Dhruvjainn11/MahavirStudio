const express = require('express');
const User = require('../../models/User');
const Product = require('../../models/Product');
const Order = require('../../models/Order');
const Category = require('../../models/Category');
const Paint = require('../../models/Paint');
const { authenticateUser, authorizeAdmin } = require('../../middleware/auth');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticateUser, authorizeAdmin, async (req, res) => {
    try {
        // Define date range for analytics (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        // Parallel queries for better performance
        const [
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            totalCategories,
            totalPaints,
            newUsersThisMonth,
            newOrdersThisMonth,
            revenueThisMonth,
            ordersByStatus,
            topSellingProducts,
            recentOrders
        ] = await Promise.all([
            // Total counts
            User.countDocuments({ isAdmin: false }),
            Product.countDocuments({ isActive: true }),
            Order.countDocuments(),
            Order.aggregate([
                { $match: { status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] } } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ]),
            Category.countDocuments({ isActive: true }),
            Paint.countDocuments({ isActive: true }),
            
            // This month's data
            User.countDocuments({ 
                isAdmin: false, 
                createdAt: { $gte: thirtyDaysAgo } 
            }),
            Order.countDocuments({ 
                createdAt: { $gte: thirtyDaysAgo } 
            }),
            Order.aggregate([
                { 
                    $match: { 
                        status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] },
                        createdAt: { $gte: thirtyDaysAgo }
                    } 
                },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ]),
            
            // Orders by status
            Order.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            
            // Top selling products
            Order.aggregate([
                { $unwind: '$items' },
                { 
                    $group: { 
                        _id: '$items.productId', 
                        totalSold: { $sum: '$items.quantity' },
                        revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
                        productName: { $first: '$items.name' }
                    } 
                },
                { $sort: { totalSold: -1 } },
                { $limit: 5 }
            ]),
            
            // Recent orders
            Order.find()
                .populate('userId', 'name email')
                .sort({ createdAt: -1 })
                .limit(5)
                .select('_id userId totalAmount status createdAt')
        ]);
    
        // Calculate growth percentages
        const userGrowth = newUsersThisMonth > 0 ? 
            ((newUsersThisMonth / Math.max(totalUsers - newUsersThisMonth, 1)) * 100) : 0;
        
        const orderGrowth = newOrdersThisMonth > 0 ? 
            ((newOrdersThisMonth / Math.max(totalOrders - newOrdersThisMonth, 1)) * 100) : 0;
            
        const revenueGrowth = revenueThisMonth[0]?.total > 0
            ? ((revenueThisMonth[0].total / Math.max((totalRevenue[0]?.total || 0) - revenueThisMonth[0].total, 1)) * 100)
            : 0;
        
        res.json({
            success: true,
            data: {
                overview: {
                    totalUsers,
                    totalProducts,
                    totalOrders,
                    totalRevenue: totalRevenue[0]?.total || 0,
                    totalCategories,
                    totalPaints
                },
                thisMonth: {
                    newUsers: newUsersThisMonth,
                    newOrders: newOrdersThisMonth,
                    revenue: revenueThisMonth[0]?.total || 0,
                    userGrowth: userGrowth,
                    orderGrowth: orderGrowth,
                    revenueGrowth: revenueGrowth
                },
                ordersByStatus: ordersByStatus.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {}),
                topSellingProducts: topSellingProducts.map(item => ({
                    id: item._id,
                    name: item.productName,
                    totalSold: item.totalSold,
                    revenue: item.revenue
                })),
                recentOrders: recentOrders.map(order => ({
                    id: order._id,
                    customer: order.userId?.name || 'Unknown',
                    email: order.userId?.email || 'N/A',
                    amount: order.totalAmount,
                    status: order.status,
                    date: order.createdAt
                }))
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch dashboard statistics' 
        });
    }
});

// Get revenue analytics
router.get('/revenue-analytics', authenticateUser, authorizeAdmin, async (req, res) => {
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

        const revenueData = await Order.aggregate([
            {
                $match: {
                    status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] },
                    createdAt: { $gte: dateRange }
                }
            },
            {
                $group: {
                    _id: groupBy,
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 } }
        ]);

        res.json({
            success: true,
            data: {
                period,
                revenueData
            }
        });
    } catch (error) {
        console.error('Revenue analytics error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch revenue analytics' 
        });
    }
});

module.exports = router;