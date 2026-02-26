import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Admin } from '@/lib/models/Admin'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB()

    // Get request body
    const body = await request.json()
    const { email, password } = body
    console.log(email, password)
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide email and password' },
        { status: 400 }
      )
    }

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password')

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if admin is active
    if (!admin.isActive) {
      return NextResponse.json(
        { success: false, message: 'Your account has been deactivated' },
        { status: 403 }
      )
    }

    // Compare passwords
    const isPasswordMatch = await admin.comparePassword(password)

    if (!isPasswordMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = generateToken({
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role,
    })

    // Update last login
    admin.lastLogin = new Date()
    await admin.save()

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Login error:', error)

    // Generic error message to prevent info leakage
    return NextResponse.json(
      { success: false, message: 'An error occurred during login' },
      { status: 500 }
    )
  }
}

// Handle other methods
export async function GET() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  )
}
