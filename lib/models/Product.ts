import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  name: string
  sku: string
  category: string
  subCategory: string
  material: string
  price: number
  originalPrice: number
  discount: number
  stock: number
  status: 'active' | 'inactive' | 'draft'
  colors: string[]
  sizes: string[]
  tags: string[]
  description: string
  image: string
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    material: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    stock: { type: Number, required: true },
    status: { type: String, enum: ['active', 'inactive', 'draft'], default: 'draft' },
    colors: [{ type: String }],
    sizes: [{ type: String }],
    tags: [{ type: String }],
    description: { type: String },
    image: { type: String },
  },
  { timestamps: true }
)

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema)
