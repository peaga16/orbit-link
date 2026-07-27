import { notFound } from 'next/navigation';
import { ClientForm, ClientFormData } from '@/components/admin/client-form';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const client = await (prisma.workspace as any).findUnique({
    where: { id: params.id },
    include: {
      links: { orderBy: { order: 'asc' } },
      pixQRCodes: true,
    },
  }).catch(() => null);

  if (!client) notFound();

  const initialData: ClientFormData = {
    id: client.id,
    name: client.name,
    slug: client.slug,
    title: client.title || '',
    description: client.description || '',
    theme: client.theme,
    primaryColor: client.primaryColor,
    secondaryColor: client.secondaryColor,
    backgroundColor: client.backgroundColor,
    backgroundImage: client.backgroundImage || '',
    fontFamily: client.fontFamily,
    logo: client.logo || '',
    headerImage: client.headerImage || '',
    showBranding: client.showBranding,
    clientEmail: client.clientEmail || '',
    clientPassword: '',
    links: client.links.map((link) => ({
      id: link.id,
      title: link.title,
      url: link.url,
      description: link.description || '',
      icon: link.icon || '',
      isActive: link.isActive,
    })),
    pixQRCodes: client.pixQRCodes.map((pix) => ({
      id: pix.id,
      title: pix.title,
      pixKey: pix.pixKey,
      amount: pix.amount,
      description: pix.description || '',
      isActive: pix.isActive,
    })),
  };

  return <ClientForm mode="edit" initialData={initialData} />;
}
