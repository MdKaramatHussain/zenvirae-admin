#!/usr/bin/env node

/**
 * Seed script to create demo admin user in MongoDB
 * Run with: node scripts/seed-admin.js
 */

const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const MONGODB_DB = process.env.MONGODB_DB || 'zenvirae_admin'

// Admin Schema
const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'superadmin'],
      default: 'admin',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
  },
  { timestamps: true }
)

const Admin = mongoose.model('Admin', adminSchema)

async function seedAdmin() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB,
    })
    console.log('✓ Connected to MongoDB')

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@zenvirae.com' })

    if (existingAdmin) {
      console.log('⚠ Admin user already exists')
      console.log('Email:', existingAdmin.email)
      console.log('Name:', existingAdmin.name)
      console.log(
        '\nTo login, use:\n  Email: admin@zenvirae.com\n  Password: Admin@123'
      )
      await mongoose.connection.close()
      return
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash('Admin@123', salt)

    // Create admin user
    const admin = await Admin.create({
      name: 'Zenvirae Admin',
      email: 'admin@zenvirae.com',
      password: hashedPassword,
      role: 'superadmin',
      isActive: true,
    })

    console.log('✓ Demo admin user created successfully')
    console.log('\nAdmin Details:')
    console.log('  Name:', admin.name)
    console.log('  Email:', admin.email)
    console.log('  Role:', admin.role)
    console.log('\nLogin Credentials:')
    console.log('  Email: admin@zenvirae.com')
    console.log('  Password: Admin@123')
    console.log('\n⚠ IMPORTANT: Change password after first login!')

    // Close connection
    await mongoose.connection.close()
    console.log('\n✓ Disconnected from MongoDB')
  } catch (error) {
    console.error('✗ Error seeding admin user:', error.message)
    process.exit(1)
  }
}

seedAdmin()
