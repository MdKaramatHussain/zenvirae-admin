import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Order } from '@/lib/models/Order'
import { Types } from 'mongoose'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
    }

    const order = await Order.findById(params.id)

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order, { status: 200 })
  } catch (error: any) {
    console.log(' Order GET error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
    }

    const body = await request.json()

    const order = await Order.findByIdAndUpdate(params.id, body, { new: true })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order, { status: 200 })
  } catch (error: any) {
    console.log(' Order PUT error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
    }

    const order = await Order.findByIdAndDelete(params.id)

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 })
  } catch (error: any) {
    console.log(' Order DELETE error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
