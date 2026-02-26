import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Return success response
    // Token cleanup is handled on client-side
    return NextResponse.json(
      {
        success: true,
        message: 'Logout successful',
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Logout error:', error)

    return NextResponse.json(
      { success: false, message: 'An error occurred during logout' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  )
}
