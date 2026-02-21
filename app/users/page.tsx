import DashboardLayout from '@/components/layout/DashboardLayout';
import UsersManager from '@/components/users/UsersManager';

export default function UsersPage() {
  return (
    <DashboardLayout>
      <UsersManager />
    </DashboardLayout>
  );
}
