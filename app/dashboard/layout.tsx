import { redirect } from 'next/navigation';
import { ClientShell } from '@/components/client/client-shell';
import { requireClientSession } from '@/lib/client-auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = requireClientSession();
  const workspace = await prisma.workspace.findUnique({
    where: { id: session.workspaceId },
    select: { name: true, slug: true, logo: true, primaryColor: true },
  }).catch(() => null);

  if (!workspace) redirect('/cliente/login');
  return <ClientShell workspace={workspace}>{children}</ClientShell>;
}
