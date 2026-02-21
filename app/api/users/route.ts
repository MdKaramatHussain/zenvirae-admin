import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { User } from '@/lib/models/User'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let query: any = {}

    if (status) {
      query.status = status
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ]
    }

    const users = await User.find(query).sort({ createdAt: -1 })

    return NextResponse.json(users, { status: 200 })
  } catch (error: any) {
    console.log(' Users GET error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    const user = new User(body)
    await user.save()

    return NextResponse.json(user, { status: 201 })
  } catch (error: any) {
    console.log(' Users POST error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
