import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ClientPublicPage } from '@/components/public/client-page';

export const revalidate = 60;

const getPublicClient = unstable_cache(
  async (slug: string) => prisma.workspace.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      title: true,
      description: true,
      theme: true,
      primaryColor: true,
      secondaryColor: true,
      backgroundColor: true,
      backgroundImage: true,
      fontFamily: true,
      logo: true,
      headerImage: true,
      showBranding: true,
      views: true,
      links: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          url: true,
          description: true,
          icon: true,
          style: true,
        },
      },
      pixQRCodes: {
        where: { isActive: true },
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          title: true,
          pixKey: true,
          amount: true,
          description: true,
        },
      },
    },
  }).catch(() => null),
  ['public-client-page'],
  { revalidate: 60, tags: ['public-pages'] },
);

export default async function PublicClientPage({ params }: { params: { slug: string } }) {
  const client = await getPublicClient(params.slug);
  if (!client) notFound();

  return <ClientPublicPage client={client} />;
}
