import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Offer } from '@/lib/models/Offer'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let query: any = {}

    if (status) {
      query.status = status
    }

    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    const offers = await Offer.find(query).sort({ createdAt: -1 })

    return NextResponse.json(offers, { status: 200 })
  } catch (error: any) {
    console.log(' Offers GET error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    const offer = new Offer(body)
    await offer.save()

    return NextResponse.json(offer, { status: 201 })
  } catch (error: any) {
    console.log(' Offers POST error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
