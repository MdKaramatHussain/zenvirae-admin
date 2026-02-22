import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { SubCategory } from '@/lib/models/SubCategory'
import { Types } from 'mongoose'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid sub-category ID' }, { status: 400 })
    }

    const subCategory = await SubCategory.findById(params.id)

    if (!subCategory) {
      return NextResponse.json({ error: 'Sub-category not found' }, { status: 404 })
    }

    return NextResponse.json(subCategory, { status: 200 })
  } catch (error: any) {
    console.log(' Sub-category GET error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    await connectDB()
    const params = await context.params;
    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid sub-category ID' }, { status: 400 })
    }

    const body = await request.json()

    const subCategory = await SubCategory.findByIdAndUpdate(params.id, body, { new: true })

    if (!subCategory) {
      return NextResponse.json({ error: 'Sub-category not found' }, { status: 404 })
    }

    return NextResponse.json(subCategory, { status: 200 })
  } catch (error: any) {
    console.log(' Sub-category PUT error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid sub-category ID' }, { status: 400 })
    }

    const subCategory = await SubCategory.findByIdAndDelete(params.id)

    if (!subCategory) {
      return NextResponse.json({ error: 'Sub-category not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Sub-category deleted successfully' }, { status: 200 })
  } catch (error: any) {
    console.log(' Sub-category DELETE error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
