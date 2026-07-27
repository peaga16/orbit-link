import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  CLIENT_COOKIE_NAME,
  clientCookieOptions,
  createClientToken,
  verifyClientPassword,
} from '@/lib/client-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');

    if (!email || !password) {
      return NextResponse.json({ error: 'Informe e-mail e senha.' }, { status: 400 });
    }

    const workspace = await (prisma.workspace as any).findUnique({
      where: { clientEmail: email },
      select: { id: true, clientEmail: true, clientPasswordHash: true },
    });

    if (!workspace?.clientEmail || !verifyClientPassword(password, workspace.clientPasswordHash)) {
      return NextResponse.json({ error: 'E-mail ou senha inválidos.' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(
      CLIENT_COOKIE_NAME,
      createClientToken({ workspaceId: workspace.id, email: workspace.clientEmail }),
      clientCookieOptions,
    );
    return response;
  } catch {
    return NextResponse.json({ error: 'Não foi possível entrar agora.' }, { status: 500 });
  }
}
