import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: params.id },
    select: { id: true },
  });

  if (!workspace) {
    return NextResponse.json({ error: 'Página não encontrada.' }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.workspace.update({
      where: { id: workspace.id },
      data: { views: { increment: 1 } },
    }),
    prisma.analytics.create({
      data: {
        workspaceId: workspace.id,
        eventType: 'view',
        referrer: request.headers.get('referer'),
        userAgent: request.headers.get('user-agent'),
      },
    }),
  ]).catch(() => null);

  return new NextResponse(null, {
    status: 204,
    headers: { 'Cache-Control': 'no-store' },
  });
}
