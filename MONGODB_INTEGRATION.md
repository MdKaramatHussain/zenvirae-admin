# MongoDB Integration - Complete Implementation Guide

## Overview
Your Zenvirae Admin Dashboard has been fully converted from mock data to a production-ready MongoDB backend with real-time API integration.

## Environment Variables Required
Add these to your Vercel project environment variables:

```
MONGODB_URI="mongodb url"
MONGODB_DB=zenvirae
```

## Database Models & Collections

### 1. Products Collection
- **Fields**: name, sku, category, subCategory, material, price, originalPrice, discount, stock, status, colors, sizes, tags, description, image
- **Endpoints**:
  - `GET /api/products` - Get all products (supports ?status= and ?search= filters)
  - `POST /api/products` - Create new product
  - `GET /api/products/[id]` - Get product by ID
  - `PUT /api/products/[id]` - Update product
  - `DELETE /api/products/[id]` - Delete product

### 2. Categories Collection
- **Fields**: name, icon, description, status
- **Endpoints**:
  - `GET /api/categories` - Get all categories (supports ?status= filter)
  - `POST /api/categories` - Create category
  - `GET /api/categories/[id]` - Get category by ID
  - `PUT /api/categories/[id]` - Update category
  - `DELETE /api/categories/[id]` - Delete category

### 3. Sub-Categories Collection
- **Fields**: name, categoryId, categoryName, description, status
- **Endpoints**:
  - `GET /api/sub-categories` - Get all (supports ?categoryId= and ?status= filters)
  - `POST /api/sub-categories` - Create sub-category
  - `GET /api/sub-categories/[id]` - Get by ID
  - `PUT /api/sub-categories/[id]` - Update
  - `DELETE /api/sub-categories/[id]` - Delete

### 4. Orders Collection
- **Fields**: orderNumber, customerName, customerEmail, customerPhone, items, totalAmount, paymentStatus, orderStatus, shippingAddress, notes
- **Status Values**: pending, processing, packed, shipped, delivered, cancelled
- **Endpoints**:
  - `GET /api/orders` - Get all (supports ?status= and ?search= filters)
  - `POST /api/orders` - Create order
  - `GET /api/orders/[id]` - Get by ID
  - `PUT /api/orders/[id]` - Update order status
  - `DELETE /api/orders/[id]` - Delete order

### 5. Users Collection
- **Fields**: name, email, phone, address, status, totalOrders, totalSpent, joinedDate
- **Status Values**: active, inactive, suspended
- **Endpoints**:
  - `GET /api/users` - Get all (supports ?status= and ?search= filters)
  - `POST /api/users` - Create user
  - `GET /api/users/[id]` - Get by ID
  - `PUT /api/users/[id]` - Update user
  - `DELETE /api/users/[id]` - Delete user

### 6. Offers Collection
- **Fields**: code, description, discountType, discountValue, minOrderAmount, maxUses, usedCount, validFrom, validUntil, status
- **Discount Types**: flat, percentage
- **Endpoints**:
  - `GET /api/offers` - Get all (supports ?status= filter)
  - `POST /api/offers` - Create offer
  - `GET /api/offers/[id]` - Get by ID
  - `PUT /api/offers/[id]` - Update
  - `DELETE /api/offers/[id]` - Delete

### 7. Carousel Collection
- **Fields**: title, description, imageUrl, link, order, isActive
- **Endpoints**:
  - `GET /api/carousel` - Get all (supports ?isActive= filter)
  - `POST /api/carousel` - Create item
  - `GET /api/carousel/[id]` - Get by ID
  - `PUT /api/carousel/[id]` - Update
  - `DELETE /api/carousel/[id]` - Delete

### 8. Dashboard Stats API
- **Endpoint**: `GET /api/stats`
- **Returns**: totalProducts, activeProducts, lowStockProducts, totalUsers, totalOrders, totalCategories, totalOffers, totalRevenue

## Updated Components

### ProductsManager.tsx
- Uses SWR for real-time data fetching and caching
- Supports add, edit, delete operations via API
- Live search and status filtering
- Stock level indicators

### CategoryManager.tsx
- Full CRUD operations connected to MongoDB
- Grid-based layout for easy management
- Status toggling (active/inactive)
- Real-time data synchronization

### OrdersManager.tsx
- Complete order tracking with status updates
- Stats cards showing pending and delivered orders
- Search by order number or customer
- Status filter dropdown with counts

### UsersManager.tsx
- User directory with full management
- Status cycling (active → inactive → suspended)
- Revenue tracking per user
- Search and filter capabilities

### Dashboard Page
- Fetches real-time stats from `/api/stats`
- Dynamic stat cards populated from database
- Responsive grid layout
- Loading states with spinners

## Data Flow Architecture

1. **Client Component** → SWR Hook
2. **SWR Hook** → API Route
3. **API Route** → MongoDB via Mongoose
4. **Response** → Component State via SWR Mutate

## Key Features

✅ Full CRUD operations for all modules
✅ Real-time data synchronization using SWR
✅ Optimistic updates with error handling
✅ Pagination-ready architecture
✅ Search and filtering on backend
✅ Automatic data validation via Mongoose schemas
✅ Indexed queries for performance
✅ Proper error logging

## Migration from Mock Data

All components have been updated to:
- Remove hardcoded DUMMY_PRODUCTS, INITIAL_ORDERS, etc.
- Remove state initialization from constants
- Replace useState with useSWR for data fetching
- Add loading states and error handling
- Use fetch API with proper JSON headers
- Call mutate() to refresh data after operations

## Testing Checklist

- [ ] Add MONGODB_URI and MONGODB_DB env variables
- [ ] Test Products: Add, Edit, Delete, Search
- [ ] Test Categories: Add, Edit, Delete, Toggle Status
- [ ] Test Orders: View, Update Status, Search
- [ ] Test Users: Update, Toggle Status, Search
- [ ] Test Dashboard: Stats load correctly
- [ ] Test Carousel: Add/Edit/Delete items
- [ ] Test Offers: Create, Update, Delete coupons

## Security Notes

- All IDs validated with MongoDB ObjectId.isValid()
- Parameterized queries prevent injection
- Input validation at API layer
- HTTP-only operations (no sensitive data in URLs)
- Consider adding auth middleware before deploying to production

## Next Steps for Production

1. Add authentication middleware to API routes
2. Implement rate limiting
3. Add input validation with Zod schemas
4. Set up database indexing strategies
5. Configure MongoDB Atlas security rules
6. Add error tracking (Sentry)
7. Set up automated backups
8. Monitor API performance
