import mongoose, { Schema, Document } from 'mongoose'

export interface ICategory extends Document {
  name: string
  icon: string
  description: string
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    icon: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
)

export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema)
