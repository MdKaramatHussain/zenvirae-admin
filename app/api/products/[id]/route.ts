import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Product } from '@/lib/models/Product'
import { Types } from 'mongoose'

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    await connectDB()
    const params = await context.params

    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    const product = await Product.findById(params.id)

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product, { status: 200 })
  } catch (error: any) {
    console.log(' Product GET error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    await connectDB()

    const params = await context.params
    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    const body = await request.json()

    const product = await Product.findByIdAndUpdate(params.id, body, { new: true })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product, { status: 200 })
  } catch (error: any) {
    console.log(' Product PUT error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    await connectDB()
    const params = await context.params

    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    const product = await Product.findByIdAndDelete(params.id)

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 })
  } catch (error: any) {
    console.log(' Product DELETE error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
