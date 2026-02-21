import { ProductsManager } from '@/components/products/ProductsManager'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function ProductsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Products
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage all your products, inventory, and pricing
          </p>
        </div>
        <ProductsManager />
      </div>
    </DashboardLayout>
  )
}
