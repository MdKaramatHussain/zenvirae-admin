import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { SubCategory } from '@/lib/models/SubCategory'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const status = searchParams.get('status')

    let query: any = {}

    if (categoryId) {
      query.categoryId = categoryId
    }

    if (status) {
      query.status = status
    }

    const subCategories = await SubCategory.find(query).sort({ createdAt: -1 })

    return NextResponse.json(subCategories, { status: 200 })
  } catch (error: any) {
    console.log(' Sub-categories GET error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    const subCategory = new SubCategory(body)
    await subCategory.save()

    return NextResponse.json(subCategory, { status: 201 })
  } catch (error: any) {
    console.log(' Sub-categories POST error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
