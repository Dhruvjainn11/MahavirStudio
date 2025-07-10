const express = require('express');
const { authenticateUser, authorizeAdmin } = require('../../middleware/auth');

const router = express.Router();

// Import admin route modules
const authRoutes = require('./auth');
const dashboardRoutes = require('./dashboard');
const categoryRoutes = require('./categories');
const paintRoutes = require('./paints');
const productRoutes = require('./products');
const orderRoutes = require('./orders');
const userRoutes = require('./users');

// Mount admin routes
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/categories', categoryRoutes);
router.use('/paints', paintRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);

// Admin panel info endpoint
router.get('/info', authenticateUser, authorizeAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'Mahavir Studio Admin Panel API',
    version: '1.0.0',
    endpoints: {
      auth: {
        login: 'POST /admin/auth/login',
        verify: 'GET /admin/auth/verify'
      },
      dashboard: {
        stats: 'GET /admin/dashboard/stats',
        revenueAnalytics: 'GET /admin/dashboard/revenue-analytics'
      },
      categories: {
        list: 'GET /admin/categories',
        create: 'POST /admin/categories',
        get: 'GET /admin/categories/:id',
        update: 'PUT /admin/categories/:id',
        delete: 'DELETE /admin/categories/:id',
        addSubcategory: 'POST /admin/categories/:id/subcategories',
        updateSubcategory: 'PUT /admin/categories/:id/subcategories/:subId',
        deleteSubcategory: 'DELETE /admin/categories/:id/subcategories/:subId'
      },
      paints: {
        list: 'GET /admin/paints',
        create: 'POST /admin/paints',
        get: 'GET /admin/paints/:id',
        update: 'PUT /admin/paints/:id',
        delete: 'DELETE /admin/paints/:id',
        brands: 'GET /admin/paints/brands/list',
        colorFamilies: 'GET /admin/paints/color-families/list',
        bulkUpdate: 'PATCH /admin/paints/bulk-update'
      },
      products: {
        list: 'GET /admin/products',
        create: 'POST /admin/products',
        get: 'GET /admin/products/:id',
        update: 'PUT /admin/products/:id',
        delete: 'DELETE /admin/products/:id',
        brands: 'GET /admin/products/brands/list',
        updateStock: 'PATCH /admin/products/:id/stock',
        bulkUpdate: 'PATCH /admin/products/bulk-update',
        lowStock: 'GET /admin/products/inventory/low-stock'
      },
      orders: {
        list: 'GET /admin/orders',
        get: 'GET /admin/orders/:id',
        updateStatus: 'PATCH /admin/orders/:id/status',
        updatePaymentStatus: 'PATCH /admin/orders/:id/payment-status',
        byStatus: 'GET /admin/orders/status/:status',
        byDateRange: 'POST /admin/orders/date-range',
        statistics: 'GET /admin/orders/statistics/overview',
        bulkUpdate: 'PATCH /admin/orders/bulk-update',
        export: 'GET /admin/orders/export/csv'
      },
      users: {
        list: 'GET /admin/users',
        get: 'GET /admin/users/:id',
        orders: 'GET /admin/users/:id/orders',
        toggleStatus: 'PATCH /admin/users/:id/toggle-status',
        statistics: 'GET /admin/users/statistics/overview',
        topCustomers: 'GET /admin/users/analytics/top-customers',
        registrationTrends: 'GET /admin/users/analytics/registration-trends',
        export: 'GET /admin/users/export/csv'
      }
    },
    features: [
      'JWT-based authentication',
      'Full CRUD operations for all entities',
      'Advanced filtering and search',
      'Pagination support',
      'Data validation',
      'Analytics and reporting',
      'Export functionality',
      'Bulk operations'
    ]
  });
});

module.exports = router;
