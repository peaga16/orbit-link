import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { CLIENT_COOKIE_NAME, verifyClientToken } from '@/lib/client-auth';
import {
  parseClientPayload,
  syncWorkspaceItems,
  workspaceFields,
} from '@/lib/admin-data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getSession(request: NextRequest) {
  return verifyClientToken(request.cookies.get(CLIENT_COOKIE_NAME)?.value);
}

export async function GET(request: NextRequest) {
  const session = getSession(request);
  if (!session) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

  const workspace = await prisma.workspace.findUnique({
    where: { id: session.workspaceId },
    include: {
      links: { orderBy: { order: 'asc' } },
      pixQRCodes: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!workspace) return NextResponse.json({ error: 'Página não encontrada.' }, { status: 404 });
  return NextResponse.json({ workspace });
}

export async function PUT(request: NextRequest) {
  const session = getSession(request);
  if (!session) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

  try {
    const payload = parseClientPayload(await request.json());
    const sameSlug = await prisma.workspace.findFirst({
      where: { slug: payload.slug, NOT: { id: session.workspaceId } },
      select: { id: true },
    });
    if (sameSlug) {
      return NextResponse.json({ error: 'Esse endereço já está sendo usado.' }, { status: 409 });
    }

    const workspace = await prisma.$transaction(async (tx) => {
      await tx.workspace.update({
        where: { id: session.workspaceId },
        data: workspaceFields(payload),
      });
      await syncWorkspaceItems(tx, session.workspaceId, payload);
      return tx.workspace.findUnique({
        where: { id: session.workspaceId },
        include: { links: { orderBy: { order: 'asc' } }, pixQRCodes: true },
      });
    });

    revalidateTag('public-pages');
    return NextResponse.json({ workspace });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Não foi possível salvar as alterações.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
