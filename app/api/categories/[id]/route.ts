import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Category } from '@/lib/models/Category'
import { Types } from 'mongoose'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 })
    }

    const category = await Category.findById(params.id)

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json(category, { status: 200 })
  } catch (error: any) {
    console.log(' Category GET error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 })
    }

    const body = await request.json()

    const category = await Category.findByIdAndUpdate(params.id, body, { new: true })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json(category, { status: 200 })
  } catch (error: any) {
    console.log(' Category PUT error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 })
    }

    const category = await Category.findByIdAndDelete(params.id)

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 })
  } catch (error: any) {
    console.log(' Category DELETE error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
