import mongoose, { Schema, Document } from 'mongoose'

export interface IOffer extends Document {
  code: string
  description: string
  discountType: 'flat' | 'percentage'
  discountValue: number
  minOrderAmount: number
  maxUses: number
  usedCount: number
  validFrom: Date
  validUntil: Date
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}

const offerSchema = new Schema<IOffer>(
  {
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    discountType: { type: String, enum: ['flat', 'percentage'], required: true },
    discountValue: { type: Number, required: true },
    minOrderAmount: { type: Number, default: 0 },
    maxUses: { type: Number, required: true },
    usedCount: { type: Number, default: 0 },
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
)

export const Offer = mongoose.models.Offer || mongoose.model<IOffer>('Offer', offerSchema)
