import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ClientPublicPage } from '@/components/public/client-page';

export const dynamic = 'force-dynamic';

export default async function PublicClientPage({ params }: { params: { slug: string } }) {
  const client = await (prisma.workspace as any).findUnique({
    where: { slug: params.slug },
    include: {
      links: { where: { isActive: true }, orderBy: { order: 'asc' } },
      pixQRCodes: { where: { isActive: true }, orderBy: { createdAt: 'asc' } },
    },
  }).catch(() => null);

  if (!client) notFound();

  await prisma.$transaction([
    prisma.workspace.update({ where: { id: client.id }, data: { views: { increment: 1 } } }),
    prisma.analytics.create({ data: { workspaceId: client.id, eventType: 'view' } }),
  ]).catch(() => null);

  return (
    <ClientPublicPage
      client={{
        id: client.id,
        name: client.name,
        slug: client.slug,
        title: client.title,
        description: client.description,
        theme: client.theme,
        primaryColor: client.primaryColor,
        secondaryColor: client.secondaryColor,
        backgroundColor: client.backgroundColor,
        backgroundImage: client.backgroundImage,
        fontFamily: client.fontFamily,
        logo: client.logo,
        headerImage: client.headerImage,
        showBranding: client.showBranding,
        views: client.views + 1,
        links: client.links.map((link) => ({
          id: link.id,
          title: link.title,
          url: link.url,
          description: link.description,
          icon: link.icon,
        })),
        pixQRCodes: client.pixQRCodes.map((pix) => ({
          id: pix.id,
          title: pix.title,
          pixKey: pix.pixKey,
          amount: pix.amount,
          description: pix.description,
        })),
      }}
    />
  );
}
