import mongoose, { Schema, Document } from 'mongoose'

export interface ICarousel extends Document {
  id: string
  title: string
  description: string
  image: string
  link: string
  order: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}

const carouselSchema = new Schema<ICarousel>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    link: { type: String },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const Carousel = mongoose.models.Carousel || mongoose.model<ICarousel>('Carousel', carouselSchema)
