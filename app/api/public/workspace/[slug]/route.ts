import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const workspace = await (prisma.workspace as any).findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        title: true,
        description: true,
        logo: true,
        headerImage: true,
        theme: true,
        primaryColor: true,
        secondaryColor: true,
        backgroundColor: true,
        backgroundImage: true,
        fontFamily: true,
        showBranding: true,
      },
    });

    if (!workspace) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      );
    }

    const links = await prisma.link.findMany({
      where: {
        workspaceId: workspace.id,
        isActive: true,
      },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        url: true,
        description: true,
        icon: true,
        clicks: true,
      },
    });

    const pixQRCodes = await prisma.pixQRCode.findMany({
      where: {
        workspaceId: workspace.id,
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        pixKey: true,
        amount: true,
        description: true,
      },
    });

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
    ]);

    return NextResponse.json({
      workspace,
      links,
      pixQRCodes,
    });
  } catch (error) {
    console.error('Error fetching workspace:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
