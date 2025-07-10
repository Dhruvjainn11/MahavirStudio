# Mahavir Studio Admin Panel Backend

A comprehensive admin panel backend for Mahavir Studio e-commerce platform built with Node.js, Express.js, and MongoDB.

## Features

### ✅ Authentication & Authorization
- JWT-based admin authentication
- Protected admin routes with middleware
- Token verification and validation

### ✅ Dashboard & Analytics
- Summary statistics (users, products, orders, revenue)
- Revenue analytics with time-based filtering
- Order status breakdown
- Top-selling products
- Recent orders overview

### ✅ Category Management
- Full CRUD operations for categories
- Nested subcategories support (parent-child structure)
- Category type filtering (hardware/paint)
- Pagination and search functionality

### ✅ Paint Management
- Add/edit/delete/list paints
- Shade name, unique color code, hex value support
- Brand management (e.g., Asian Paints)
- Color family and finish categorization
- Available sizes with pricing
- Advanced filtering and search

### ✅ Product Management
- Complete product CRUD operations
- Category and subcategory association
- Available colors (linked to paints)
- Stock management
- Image gallery support
- Brand and model information
- Specifications as key-value pairs
- Low stock alerts
- Bulk operations

### ✅ Order Management
- View all orders with advanced filtering
- Update order status (pending, shipped, delivered, cancelled)
- Payment status management
- Filter by status, date range, customer
- Order statistics and analytics
- Export functionality
- Bulk operations

### ✅ User Management
- List all users (view-only for admin)
- User statistics and analytics
- Order history per user
- Top customers analysis
- User registration trends
- Export user data

## API Endpoints

### Authentication
```http
POST /api/admin/auth/login
GET  /api/admin/auth/verify
```

### Dashboard
```http
GET /api/admin/dashboard/stats
GET /api/admin/dashboard/revenue-analytics
```

### Categories
```http
GET    /api/admin/categories
POST   /api/admin/categories
GET    /api/admin/categories/:id
PUT    /api/admin/categories/:id
DELETE /api/admin/categories/:id

# Subcategories
POST   /api/admin/categories/:id/subcategories
PUT    /api/admin/categories/:id/subcategories/:subId
DELETE /api/admin/categories/:id/subcategories/:subId
```

### Paints
```http
GET    /api/admin/paints
POST   /api/admin/paints
GET    /api/admin/paints/:id
PUT    /api/admin/paints/:id
DELETE /api/admin/paints/:id
GET    /api/admin/paints/brands/list
GET    /api/admin/paints/color-families/list
PATCH  /api/admin/paints/bulk-update
```

### Products
```http
GET    /api/admin/products
POST   /api/admin/products
GET    /api/admin/products/:id
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id
GET    /api/admin/products/brands/list
PATCH  /api/admin/products/:id/stock
PATCH  /api/admin/products/bulk-update
GET    /api/admin/products/inventory/low-stock
```

### Orders
```http
GET    /api/admin/orders
GET    /api/admin/orders/:id
PATCH  /api/admin/orders/:id/status
PATCH  /api/admin/orders/:id/payment-status
GET    /api/admin/orders/status/:status
POST   /api/admin/orders/date-range
GET    /api/admin/orders/statistics/overview
PATCH  /api/admin/orders/bulk-update
GET    /api/admin/orders/export/csv
```

### Users
```http
GET    /api/admin/users
GET    /api/admin/users/:id
GET    /api/admin/users/:id/orders
PATCH  /api/admin/users/:id/toggle-status
GET    /api/admin/users/statistics/overview
GET    /api/admin/users/analytics/top-customers
GET    /api/admin/users/analytics/registration-trends
GET    /api/admin/users/export/csv
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)

### Environment Variables
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/mahavirstudio
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
PORT=3001
```

### Installation
```bash
# Install dependencies
npm install

# Create admin user
node scripts/createAdmin.js

# Start the server
npm start
```

### Default Admin Credentials
- **Email:** admin@mahavirstudio.com
- **Password:** admin123
- ⚠️ **Important:** Change password after first login!

## Data Validation

### Paint Model Requirements
- `name`: 2-100 characters
- `shadeCode`: Unique identifier, 1-20 characters
- `hexValue`: Valid hex color code (e.g., #FF0000)
- `brand`: Required, 1-50 characters
- `colorFamily`: Required, 1-50 characters
- `finish`: Required, 1-50 characters
- `categoryId`: Valid MongoDB ObjectId
- `availableSizes`: Array with size and price

### Product Model Requirements
- `name`: 2-100 characters
- `description`: 10-2000 characters
- `price`: Positive number
- `categoryId`: Valid MongoDB ObjectId
- `type`: 'hardware' or 'paint'
- `stock`: Non-negative integer
- `availableColors`: Array of Paint ObjectIds (optional)

### Category Model Requirements
- `name`: 2-50 characters, unique per type
- `type`: 'hardware' or 'paint'
- `description`: Max 500 characters (optional)

## Query Parameters

### Pagination
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

### Search & Filters
- `search`: Search term for text fields
- `sortBy`: Field to sort by
- `sortOrder`: 'asc' or 'desc'
- Entity-specific filters (status, type, brand, etc.)

### Date Filters
- `startDate`: ISO8601 date string
- `endDate`: ISO8601 date string

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": [ ... ] // For validation errors
}
```

### Pagination Response
```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 100,
      "itemsPerPage": 10
    }
  }
}
```

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on auth endpoints
- Input validation and sanitization
- Admin-only route protection
- CORS configuration
- Helmet security headers

## Database Indexes

Optimized queries with proper indexing:
- Text search indexes on names and descriptions
- Compound indexes for filtering
- Unique indexes for codes and emails

## Error Handling

Comprehensive error handling for:
- Validation errors
- Duplicate entries
- Not found resources
- Authentication failures
- Server errors

## API Documentation

Access the API info endpoint:
```http
GET /api/admin/info
```

This provides a complete overview of all available endpoints and features.

## Development Notes

- All admin routes require authentication (`authenticateUser`) and authorization (`authorizeAdmin`)
- Passwords are automatically hashed before saving to database
- Soft delete pattern can be implemented by using `isActive` flags
- All responses follow consistent JSON structure
- Comprehensive logging for debugging and monitoring

## Deployment Considerations

1. **Environment Variables**: Set production values for all environment variables
2. **Database**: Use MongoDB Atlas or similar for production
3. **Security**: Implement additional security measures (rate limiting, input sanitization)
4. **Monitoring**: Add logging and monitoring solutions
5. **Backup**: Implement database backup strategies

---

## Support

For issues or questions regarding the admin panel backend, please refer to the API documentation or contact the development team.
