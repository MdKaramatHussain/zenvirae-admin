import DashboardLayout from '@/components/layout/DashboardLayout';
import OrdersManager from '@/components/orders/OrdersManager';

export default function OrdersPage() {
  return (
    <DashboardLayout>
      <OrdersManager />
    </DashboardLayout>
  );
}
