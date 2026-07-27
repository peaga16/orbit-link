import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const CLIENT_COOKIE_NAME = 'orbit_client_session';
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

type ClientSession = {
  workspaceId: string;
  email: string;
};

function getSecret() {
  return process.env.CLIENT_SESSION_SECRET
    || process.env.ADMIN_SESSION_SECRET
    || 'orbit-client-dev-secret-change-before-production';
}

function sign(value: string) {
  return createHmac('sha256', getSecret()).update(value).digest('base64url');
}

export function hashClientPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

export function verifyClientPassword(password: string, storedHash?: string | null) {
  if (!storedHash) return false;
  const [algorithm, salt, expectedHex] = storedHash.split(':');
  if (algorithm !== 'scrypt' || !salt || !expectedHex) return false;

  try {
    const actual = scryptSync(password, salt, 64);
    const expected = Buffer.from(expectedHex, 'hex');
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function createClientToken(session: ClientSession) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
  const payload = Buffer.from(
    JSON.stringify({ ...session, expiresAt }),
  ).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function verifyClientToken(token?: string | null): ClientSession | null {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload));
  const provided = Buffer.from(signature);
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) return null;

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as ClientSession & { expiresAt: number };
    if (!decoded.workspaceId || !decoded.email || decoded.expiresAt <= Math.floor(Date.now() / 1000)) return null;
    return { workspaceId: decoded.workspaceId, email: decoded.email };
  } catch {
    return null;
  }
}

export function getClientSession() {
  return verifyClientToken(cookies().get(CLIENT_COOKIE_NAME)?.value);
}

export function requireClientSession() {
  const session = getClientSession();
  if (!session) redirect('/cliente/login');
  return session;
}

export const clientCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: SESSION_DURATION_SECONDS,
};
