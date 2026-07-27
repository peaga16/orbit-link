import { ClientForm, ClientFormData } from '@/components/admin/client-form';
import { requireClientSession } from '@/lib/client-auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function EditOwnPage() {
  const session = requireClientSession();
  const workspace = await (prisma.workspace as any).findUnique({
    where: { id: session.workspaceId },
    include: {
      links: { orderBy: { order: 'asc' } },
      pixQRCodes: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!workspace) return null;

  const initialData: ClientFormData = {
    id: workspace.id,
    name: workspace.name,
    slug: workspace.slug,
    title: workspace.title || '',
    description: workspace.description || '',
    theme: workspace.theme,
    primaryColor: workspace.primaryColor,
    secondaryColor: workspace.secondaryColor,
    backgroundColor: workspace.backgroundColor,
    backgroundImage: workspace.backgroundImage || '',
    fontFamily: workspace.fontFamily,
    logo: workspace.logo || '',
    headerImage: workspace.headerImage || '',
    showBranding: workspace.showBranding,
    clientEmail: '',
    clientPassword: '',
    links: workspace.links.map((link) => ({
      id: link.id,
      title: link.title,
      url: link.url,
      description: link.description || '',
      icon: link.icon || '',
      isActive: link.isActive,
    })),
    pixQRCodes: workspace.pixQRCodes.map((pix) => ({
      id: pix.id,
      title: pix.title,
      pixKey: pix.pixKey,
      amount: pix.amount,
      description: pix.description || '',
      isActive: pix.isActive,
    })),
  };

  return <ClientForm mode="edit" initialData={initialData} access="client" />;
}
