
interface Product {
  _id?: string
  id?: string
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
}