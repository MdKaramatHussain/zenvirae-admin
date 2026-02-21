
// import mongoose from 'mongoose'

const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.MONGODB_DB

if (!MONGODB_URI || !MONGODB_DB) {
  console.error(' MONGODB_URI and MONGODB_DB environment variables are required')
  process.exit(1)
}

// Define schemas
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  categoryId: { type: String, required: true },
  categoryName: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  material: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  stock: { type: Number, required: true },
  status: { type: String, enum: ['active', 'inactive', 'draft'], default: 'draft' },
  colors: [String],
  sizes: [String],
  tags: [String],
  description: String,
  image: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  items: [
    {
      productId: String,
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  orderStatus: { type: String, enum: ['pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  shippingAddress: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: String,
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  joinedDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const offerSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  discountType: { type: String, enum: ['flat', 'percentage'], required: true },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  maxUses: { type: Number, required: true },
  usedCount: { type: Number, default: 0 },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const carouselSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  imageUrl: { type: String, required: true },
  link: String,
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB })
    console.log(' Connected to MongoDB')

    const Category = mongoose.model('Category', categorySchema)
    const SubCategory = mongoose.model('SubCategory', subCategorySchema)
    const Product = mongoose.model('Product', productSchema)
    const Order = mongoose.model('Order', orderSchema)
    const User = mongoose.model('User', userSchema)
    const Offer = mongoose.model('Offer', offerSchema)
    const Carousel = mongoose.model('Carousel', carouselSchema)

    // Clear existing data
    console.log(' Clearing existing data...')
    await Promise.all([
      Category.deleteMany({}),
      SubCategory.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      User.deleteMany({}),
      Offer.deleteMany({}),
      Carousel.deleteMany({}),
    ])

    // Seed Categories
    console.log(' Seeding categories...')
    const categories = await Category.insertMany([
      { name: 'Men', icon: '👔', description: 'Mens clothing and accessories' },
      { name: 'Women', icon: '👗', description: 'Womens clothing and accessories' },
      { name: 'Accessories', icon: '⌚', description: 'Fashion accessories' },
    ])

    // Seed Sub-Categories
    console.log(' Seeding sub-categories...')
    await SubCategory.insertMany([
      { name: 'Shirts', categoryId: categories[0]._id, categoryName: 'Men' },
      { name: 'Pants', categoryId: categories[0]._id, categoryName: 'Men' },
      { name: 'Dresses', categoryId: categories[1]._id, categoryName: 'Women' },
      { name: 'Skirts', categoryId: categories[1]._id, categoryName: 'Women' },
    ])

    // Seed Products
    console.log(' Seeding products...')
    await Product.insertMany([
      {
        name: 'Italian Wool Suit',
        sku: 'IWS-001',
        category: 'Men',
        subCategory: 'Shirts',
        material: 'Wool',
        price: 14999,
        originalPrice: 18999,
        discount: 21,
        stock: 50,
        status: 'active',
        colors: ['Black', 'Navy', 'Gray'],
        sizes: ['S', 'M', 'L', 'XL'],
        tags: ['Premium', 'Formal'],
        description: 'Premium Italian wool suit perfect for formal occasions',
      },
      {
        name: 'Cashmere Sweater',
        sku: 'CS-002',
        category: 'Women',
        subCategory: 'Dresses',
        material: 'Cashmere',
        price: 4500,
        originalPrice: 6000,
        discount: 25,
        stock: 30,
        status: 'active',
        colors: ['White', 'Beige', 'Black'],
        sizes: ['XS', 'S', 'M', 'L'],
        tags: ['Luxury', 'Winter'],
        description: 'Soft cashmere sweater for warmth and style',
      },
    ])

    // Seed Users
    console.log(' Seeding users...')
    await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
        address: '123 Main St',
        status: 'active',
        totalOrders: 5,
        totalSpent: 45000,
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '9876543211',
        address: '456 Oak Ave',
        status: 'active',
        totalOrders: 8,
        totalSpent: 125000,
      },
    ])

    // Seed Orders
    console.log(' Seeding orders...')
    await Order.insertMany([
      {
        orderNumber: 'ORD-001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '9876543210',
        items: [{ productId: 'IWS-001', name: 'Italian Wool Suit', quantity: 1, price: 14999 }],
        totalAmount: 14999,
        paymentStatus: 'completed',
        orderStatus: 'delivered',
        shippingAddress: '123 Main St',
      },
      {
        orderNumber: 'ORD-002',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah@example.com',
        customerPhone: '9876543211',
        items: [{ productId: 'CS-002', name: 'Cashmere Sweater', quantity: 2, price: 4500 }],
        totalAmount: 9000,
        paymentStatus: 'pending',
        orderStatus: 'processing',
        shippingAddress: '456 Oak Ave',
      },
    ])

    // Seed Offers
    console.log(' Seeding offers...')
    await Offer.insertMany([
      {
        code: 'WELCOME20',
        description: '20% off on first purchase',
        discountType: 'percentage',
        discountValue: 20,
        minOrderAmount: 1000,
        maxUses: 100,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active',
      },
      {
        code: 'FLAT500',
        description: 'Flat 500 rupees off',
        discountType: 'flat',
        discountValue: 500,
        minOrderAmount: 2000,
        maxUses: 50,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active',
      },
    ])

    // Seed Carousel
    console.log(' Seeding carousel...')
    await Carousel.insertMany([
      {
        title: 'Summer Collection',
        description: 'Explore our latest summer collection',
        imageUrl: '/carousel/summer.jpg',
        link: '/collections/summer',
        order: 1,
        isActive: true,
      },
      {
        title: 'Premium Selection',
        description: 'Hand-picked premium items',
        imageUrl: '/carousel/premium.jpg',
        link: '/collections/premium',
        order: 2,
        isActive: true,
      },
    ])

    console.log(' Database seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error(' Seeding error:', error.message)
    process.exit(1)
  }
}

seedDatabase()
// export default seedDatabase
