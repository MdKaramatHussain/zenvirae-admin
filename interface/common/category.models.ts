
export interface Category {
  _id?: string
  id?: string
  name: string
  icon: string
  description: string
  status?: 'active' | 'inactive'
}
export interface SubCategory {
  _id?: string;
  id?: string;
  name: string;
  categoryId: string;
  categoryName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  image: string;
  productCount: number | null;
}