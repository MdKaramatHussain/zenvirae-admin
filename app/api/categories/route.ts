import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Category } from '@/lib/models/Category'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query: any = {}

    if (status) {
      query.status = status
    }

    const categories = await Category.find(query).sort({ createdAt: -1 })

    return NextResponse.json(categories, { status: 200 })
  } catch (error: any) {
    console.log(' Categories GET error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    const category = new Category(body)
    await category.save()

    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    console.log(' Categories POST error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
