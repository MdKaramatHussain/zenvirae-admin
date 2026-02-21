
interface StatsData {
  totalProducts: number
  activeProducts: number
  totalUsers: number
  totalOrders: number
  totalCategories: number
  totalOffers: number
  totalRevenue: number
}

interface StatCardProps {
  icon: string
  label: string
  value: string | number
  trend: string
  color: string
}