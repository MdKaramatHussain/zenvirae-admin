import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Product } from '@/lib/models/Product'
import { Order } from '@/lib/models/Order'
import { User } from '@/lib/models/User'
import { Category } from '@/lib/models/Category'
import { Offer } from '@/lib/models/Offer'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const [totalProducts, activeProducts, lowStockProducts, totalUsers, totalOrders, totalCategories, totalOffers, totalRevenue] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: 'active' }),
      Product.countDocuments({ stock: { $lt: 20 } }),
      User.countDocuments(),
      Order.countDocuments(),
      Category.countDocuments(),
      Offer.countDocuments({ status: 'active' }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    ])

    const stats = {
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalUsers,
      totalOrders,
      totalCategories,
      totalOffers,
      totalRevenue: totalRevenue[0]?.total || 0,
    }

    return NextResponse.json(stats, { status: 200 })
  } catch (error: any) {
    console.log(' Stats GET error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
