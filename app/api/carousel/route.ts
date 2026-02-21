import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Carousel } from '@/lib/models/Carousel'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')

    let query: any = {}

    if (isActive !== null) {
      query.isActive = isActive === 'true'
    }

    const carouselItems = await Carousel.find(query).sort({ order: 1 })

    return NextResponse.json(carouselItems, { status: 200 })
  } catch (error: any) {
    console.log('Carousel GET error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    const carouselItem = new Carousel(body)
    await carouselItem.save()

    return NextResponse.json(carouselItem, { status: 201 })
  } catch (error: any) {
    console.log(' Carousel POST error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const isBulkUpdate = searchParams.get('isBulkUpdate')

    if (isBulkUpdate) {
      const operations = body.map((item : any) => ({
        updateOne: {
          filter: { _id: item._id },
          update: { $set: { order: item.order } }
        }
      }))
      const operationSuccess = await Carousel.bulkWrite(operations)
      if (operationSuccess) {
        return NextResponse.json({ status: 200 })
      } else {
        return NextResponse.json({ status: 400 })
      }
    }

    let carouselItem = new Carousel(body)
    const { _id, ...updateData } = carouselItem
    const updatedData = await Carousel.findByIdAndUpdate(_id, updateData, { new: true })
    if (updatedData) {
      return NextResponse.json({ status: 200 })
    } else {
      return NextResponse.json({ status: 404 })
    }
  } catch (error: any) {
    console.log(' Carousel PUT error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

