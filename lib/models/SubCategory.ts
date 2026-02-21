import mongoose, { Schema, Document } from 'mongoose'

export interface ISubCategory extends Document {
  name: string
  categoryId: string
  categoryName: string
  description: string
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}

const subCategorySchema = new Schema<ISubCategory>(
  {
    name: { type: String, required: true },
    categoryId: { type: String, required: true },
    categoryName: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
)

subCategorySchema.index({ categoryId: 1, name: 1 }, { unique: true })

export const SubCategory = mongoose.models.SubCategory || mongoose.model<ISubCategory>('SubCategory', subCategorySchema)
