import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  adminCookieOptions,
  createAdminToken,
} from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');
    const expectedEmail = (process.env.ADMIN_EMAIL || 'admin@orbitlink.com').toLowerCase();
    const expectedPassword = process.env.ADMIN_PASSWORD || 'Orbit@2026';

    if (email !== expectedEmail || password !== expectedPassword) {
      return NextResponse.json(
        { error: 'E-mail ou senha inválidos.' },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(
      ADMIN_COOKIE_NAME,
      createAdminToken(email),
      adminCookieOptions,
    );
    return response;
  } catch {
    return NextResponse.json(
      { error: 'Não foi possível iniciar a sessão.' },
      { status: 400 },
    );
  }
}
