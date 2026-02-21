import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  phone: string
  address: string
  status: 'active' | 'inactive' | 'suspended'
  totalOrders: number
  totalSpent: number
  joinedDate: Date
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String },
    status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    joinedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema)
