import { NextResponse } from 'next/server';
import { CLIENT_COOKIE_NAME } from '@/lib/client-auth';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(CLIENT_COOKIE_NAME, '', { path: '/', maxAge: 0 });
  return response;
}
