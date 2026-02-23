import mongoose, { Schema, Document } from 'mongoose'

export interface IOffer extends Document {
  id: string
  code: string
  description: string
  discountType: 'flat' | 'percentage'
  discountValue: number
  minOrderAmount: number
  maxUses: number
  usedCount: number
  startDate: Date
  validUntil: Date
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}

const offerSchema = new Schema<IOffer>(
  {
    id: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    discountType: { type: String, enum: ['flat', 'percentage'], required: true },
    discountValue: { type: Number, required: true },
    minOrderAmount: { type: Number, default: 0 },
    maxUses: { type: Number, required: true },
    usedCount: { type: Number, default: 0 },
    startDate: { type: Date },
    validUntil: { type: Date },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
)

export const Offer = mongoose.models.Offer || mongoose.model<IOffer>('Offer', offerSchema)
