import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPage = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isAdminApi = pathname.startsWith('/api/admin') && pathname !== '/api/admin/login';
  const isClientPage = pathname.startsWith('/dashboard');
  const isClientApi = pathname.startsWith('/api/client') && pathname !== '/api/client/login';

  const hasAdminSession = Boolean(request.cookies.get('orbit_admin_session')?.value);
  const hasClientSession = Boolean(request.cookies.get('orbit_client_session')?.value);

  if (isAdminPage && !hasAdminSession) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminApi && !hasAdminSession) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  if (isClientPage && !hasClientSession) {
    const loginUrl = new URL('/cliente/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isClientApi && !hasClientSession) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/api/admin/:path*',
    '/api/client/:path*',
  ],
};
