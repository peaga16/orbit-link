import { unstable_cache } from 'next/cache';
import { ModernLanding, LandingClient } from '@/components/landing/modern-landing';
import { prisma } from '@/lib/prisma';

export const revalidate = 120;

const getLandingData = unstable_cache(
  async () => {
    try {
      const [summary, clients] = await Promise.all([
        prisma.workspace.aggregate({
          _count: { id: true },
          _sum: { views: true, clicks: true },
        }),
        prisma.workspace.findMany({
          take: 4,
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
              take: 4,
              where: { isActive: true },
              orderBy: { order: 'asc' },
              select: { id: true, title: true, icon: true },
            },
          },
        }),
      ]);

      return {
        clients: clients as LandingClient[],
        stats: {
          clients: summary._count.id,
          views: summary._sum.views || 0,
          clicks: summary._sum.clicks || 0,
        },
      };
    } catch {
      return { clients: [] as LandingClient[], stats: { clients: 0, views: 0, clicks: 0 } };
    }
  },
  ['landing-data'],
  { revalidate: 120, tags: ['public-pages'] },
);

export default async function HomePage() {
  const data = await getLandingData();
  return <ModernLanding clients={data.clients} stats={data.stats} />;
}
