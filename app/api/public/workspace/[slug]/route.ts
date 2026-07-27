import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const workspace = await prisma.workspace.findUnique({
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

    // Increment view count
    await prisma.workspace.update({
      where: { id: workspace.id },
      data: { views: { increment: 1 } },
    });

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
