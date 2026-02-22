// Categories Data
export interface Category {
  id: string;
  name: string;
  image: string;
  active: boolean;
  createdAt: string;
  productCount: number;
}

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    image: '📱',
    active: true,
    createdAt: '2024-01-15',
    productCount: 342,
  },
  {
    id: '2',
    name: 'Fashion',
    image: '👗',
    active: true,
    createdAt: '2024-01-16',
    productCount: 587,
  },
  {
    id: '3',
    name: 'Home & Garden',
    image: '🏠',
    active: true,
    createdAt: '2024-01-17',
    productCount: 456,
  },
  {
    id: '4',
    name: 'Sports',
    image: '⚽',
    active: false,
    createdAt: '2024-01-18',
    productCount: 234,
  },
];

export interface SubCategoryTemp {
  id: string;
  name: string;
  parentCategoryId: string;
  image: string;
  active: boolean;
  createdAt: string;
  productCount: number;
}

export const INITIAL_SUB_CATEGORIES: SubCategoryTemp[] = [
  {
    id: '1',
    name: 'Smartphones',
    parentCategoryId: '1',
    image: '📱',
    active: true,
    createdAt: '2024-01-20',
    productCount: 156,
  },
  {
    id: '2',
    name: 'Laptops',
    parentCategoryId: '1',
    image: '💻',
    active: true,
    createdAt: '2024-01-21',
    productCount: 89,
  },
  {
    id: '3',
    name: 'Men',
    parentCategoryId: '2',
    image: '👔',
    active: true,
    createdAt: '2024-01-22',
    productCount: 234,
  },
  {
    id: '4',
    name: 'Women',
    parentCategoryId: '2',
    image: '👠',
    active: true,
    createdAt: '2024-01-23',
    productCount: 353,
  },
];
