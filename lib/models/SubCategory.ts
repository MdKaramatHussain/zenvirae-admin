import mongoose, { Schema, Document } from 'mongoose'

export interface ISubCategory extends Document {
  name: string
  categoryId: string
  categoryName: string
  description: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
  image: string
  productCount: number
}

const subCategorySchema = new Schema<ISubCategory>(
  {
    name: { type: String, required: true },
    categoryId: { type: String, required: true },
    categoryName: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdAt: { type: String },
    updatedAt: { type: String },
    image: { type: String },
    productCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

subCategorySchema.index({ categoryId: 1, name: 1 }, { unique: true })

export const SubCategory = mongoose.models.SubCategory || mongoose.model<ISubCategory>('SubCategory', subCategorySchema)
