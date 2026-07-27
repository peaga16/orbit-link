import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const link = await prisma.link.findUnique({
    where: { id: params.id },
    include: { workspace: true },
  });

  if (!link || !link.isActive) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  await prisma.$transaction([
    prisma.link.update({ where: { id: link.id }, data: { clicks: { increment: 1 } } }),
    prisma.workspace.update({ where: { id: link.workspaceId }, data: { clicks: { increment: 1 } } }),
    prisma.analytics.create({
      data: {
        workspaceId: link.workspaceId,
        linkId: link.id,
        eventType: 'click',
        referrer: request.headers.get('referer'),
        userAgent: request.headers.get('user-agent'),
      },
    }),
  ]).catch(() => null);

  return NextResponse.redirect(link.url);
}
