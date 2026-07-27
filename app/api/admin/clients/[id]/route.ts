import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import {
  parseClientPayload,
  syncWorkspaceItems,
  workspaceFields,
} from '@/lib/admin-data';
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/admin-auth';
import { hashClientPassword } from '@/lib/client-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function unauthorized(request: NextRequest) {
  return !verifyAdminToken(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (unauthorized(request)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const client = await prisma.workspace.findUnique({
    where: { id: params.id },
    include: {
      links: { orderBy: { order: 'asc' } },
      pixQRCodes: true,
    },
  });

  if (!client) {
    return NextResponse.json({ error: 'Cliente não encontrado.' }, { status: 404 });
  }

  return NextResponse.json({ client });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (unauthorized(request)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const payload = parseClientPayload(await request.json());
    if (!payload.clientEmail) throw new Error('Informe um e-mail de acesso para o cliente.');
    if (payload.clientPassword && payload.clientPassword.length < 8) {
      throw new Error('A nova senha deve ter pelo menos 8 caracteres.');
    }

    const duplicate = await (prisma.workspace as any).findFirst({
      where: {
        NOT: { id: params.id },
        OR: [{ slug: payload.slug }, { clientEmail: payload.clientEmail }],
      },
      select: { slug: true, clientEmail: true },
    });

    if (duplicate?.slug === payload.slug) {
      return NextResponse.json({ error: 'Esse endereço já está sendo usado por outro cliente.' }, { status: 409 });
    }
    if (duplicate?.clientEmail === payload.clientEmail) {
      return NextResponse.json({ error: 'Esse e-mail já está vinculado a outro cliente.' }, { status: 409 });
    }

    const client = await prisma.$transaction(async (tx) => {
      await (tx.workspace as any).update({
        where: { id: params.id },
        data: {
          ...workspaceFields(payload),
          clientEmail: payload.clientEmail,
          ...(payload.clientPassword
            ? { clientPasswordHash: hashClientPassword(payload.clientPassword) }
            : {}),
        },
      });
      await syncWorkspaceItems(tx, params.id, payload);
      return (tx.workspace as any).findUnique({
        where: { id: params.id },
        include: { links: { orderBy: { order: 'asc' } }, pixQRCodes: true },
      });
    });

    revalidateTag('public-pages');
    return NextResponse.json({ client });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Não foi possível atualizar o cliente.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (unauthorized(request)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    await prisma.workspace.delete({ where: { id: params.id } });
    revalidateTag('public-pages');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Cliente não encontrado.' }, { status: 404 });
  }
}
