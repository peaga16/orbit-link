import { AdminShell } from '@/components/admin/admin-shell';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  requireAdmin();
  return <AdminShell>{children}</AdminShell>;
}
