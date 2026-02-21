import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Order } from '@/lib/models/Order'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let query: any = {}

    if (status) {
      query.orderStatus = status
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
      ]
    }

    const orders = await Order.find(query).sort({ createdAt: -1 })

    return NextResponse.json(orders, { status: 200 })
  } catch (error: any) {
    console.log(' Orders GET error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    const order = new Order(body)
    await order.save()

    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    console.log(' Orders POST error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
