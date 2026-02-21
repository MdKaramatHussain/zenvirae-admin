import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Carousel } from '@/lib/models/Carousel'
import { Types } from 'mongoose'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid carousel ID' }, { status: 400 })
    }

    const carouselItem = await Carousel.findById(params.id)

    if (!carouselItem) {
      return NextResponse.json({ error: 'Carousel item not found' }, { status: 404 })
    }

    return NextResponse.json(carouselItem, { status: 200 })
  } catch (error: any) {
    console.log(' Carousel GET error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid carousel ID' }, { status: 400 })
    }

    const body = await request.json()

    const carouselItem = await Carousel.findByIdAndUpdate(params.id, body, { new: true })

    if (!carouselItem) {
      return NextResponse.json({ error: 'Carousel item not found' }, { status: 404 })
    }

    return NextResponse.json(carouselItem, { status: 200 })
  } catch (error: any) {
    console.log(' Carousel PUT error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    await connectDB()
    const params  = await context.params
    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid carousel ID' }, { status: 400 })
    }

    const carouselItem = await Carousel.findByIdAndDelete(params.id)

    if (!carouselItem) {
      return NextResponse.json({ error: 'Carousel item not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Carousel item deleted successfully' }, { status: 200 })
  } catch (error: any) {
    console.log(' Carousel DELETE error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
