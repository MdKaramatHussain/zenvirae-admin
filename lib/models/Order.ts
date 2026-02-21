import mongoose, { Schema, Document } from 'mongoose'

export interface IOrder extends Document {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: Array<{
    productId: string
    name: string
    quantity: number
    price: number
  }>
  totalAmount: number
  paymentStatus: 'pending' | 'completed' | 'failed'
  orderStatus: 'pending' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: string
  notes: string
  createdAt: Date
  updatedAt: Date
}

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    items: [
      {
        productId: String,
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    orderStatus: { type: String, enum: ['pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    shippingAddress: { type: String, required: true },
    notes: { type: String },
  },
  { timestamps: true }
)

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema)
