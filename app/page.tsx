import { ModernLanding, LandingClient } from '@/components/landing/modern-landing';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const clients = await (prisma.workspace as any).findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      title: true,
      description: true,
      primaryColor: true,
      secondaryColor: true,
      backgroundColor: true,
      backgroundImage: true,
      logo: true,
      headerImage: true,
      views: true,
      clicks: true,
      links: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
        select: { id: true, title: true, icon: true },
      },
    },
  }).catch(() => []) as LandingClient[];

  return <ModernLanding clients={clients} />;
}
