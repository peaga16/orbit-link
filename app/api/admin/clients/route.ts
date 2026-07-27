import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getOrCreateAdminUser,
  parseClientPayload,
  syncWorkspaceItems,
  workspaceFields,
} from '@/lib/admin-data';
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/admin-auth';
import { hashClientPassword } from '@/lib/client-auth';

function unauthorized(request: NextRequest) {
  return !verifyAdminToken(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
}

export async function GET(request: NextRequest) {
  if (unauthorized(request)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const clients = await prisma.workspace.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      links: { orderBy: { order: 'asc' } },
      pixQRCodes: true,
    },
  });

  return NextResponse.json({ clients });
}

export async function POST(request: NextRequest) {
  if (unauthorized(request)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const payload = parseClientPayload(await request.json());
    if (!payload.clientEmail) throw new Error('Informe um e-mail de acesso para o cliente.');
    if (!payload.clientPassword || payload.clientPassword.length < 8) {
      throw new Error('A senha do cliente deve ter pelo menos 8 caracteres.');
    }

    const duplicate = await (prisma.workspace as any).findFirst({
      where: { OR: [{ slug: payload.slug }, { clientEmail: payload.clientEmail }] },
      select: { slug: true, clientEmail: true },
    });

    if (duplicate?.slug === payload.slug) {
      return NextResponse.json({ error: 'Esse endereço já está sendo usado por outro cliente.' }, { status: 409 });
    }
    if (duplicate?.clientEmail === payload.clientEmail) {
      return NextResponse.json({ error: 'Esse e-mail já está vinculado a outro cliente.' }, { status: 409 });
    }

    const admin = await getOrCreateAdminUser();
    const client = await prisma.$transaction(async (tx) => {
      const created = await (tx.workspace as any).create({
        data: {
          userId: admin.id,
          ...workspaceFields(payload),
          clientEmail: payload.clientEmail,
          clientPasswordHash: hashClientPassword(payload.clientPassword!),
        },
      });
      await syncWorkspaceItems(tx, created.id, payload);
      return (tx.workspace as any).findUnique({
        where: { id: created.id },
        include: { links: { orderBy: { order: 'asc' } }, pixQRCodes: true },
      });
    });

    return NextResponse.json({ client }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Não foi possível criar o cliente.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
