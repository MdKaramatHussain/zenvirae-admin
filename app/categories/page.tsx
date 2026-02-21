import DashboardLayout from '@/components/layout/DashboardLayout';
import CategoryManager from '@/components/category/CategoryManager';

export default function CategoriesPage() {
  return (
    <DashboardLayout>
      <CategoryManager />
    </DashboardLayout>
  );
}
