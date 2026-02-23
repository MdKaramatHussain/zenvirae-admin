import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Offer } from '@/lib/models/Offer'
import { Types } from 'mongoose'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid offer ID' }, { status: 400 })
    }

    const offer = await Offer.findById(params.id)

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
    }

    return NextResponse.json(offer, { status: 200 })
  } catch (error: any) {
    console.log(' Offer GET error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    await connectDB()
    const params = await context.params;
    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid offer ID' }, { status: 400 })
    }

    const body = await request.json()

    const offer = await Offer.findByIdAndUpdate(params.id, body, { new: true })

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
    }

    return NextResponse.json(offer, { status: 200 })
  } catch (error: any) {
    console.log(' Offer PUT error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid offer ID' }, { status: 400 })
    }

    const offer = await Offer.findByIdAndDelete(params.id)

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Offer deleted successfully' }, { status: 200 })
  } catch (error: any) {
    console.log(' Offer DELETE error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
