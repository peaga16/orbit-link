import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/admin-auth';
import { CLIENT_COOKIE_NAME, verifyClientToken } from '@/lib/client-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Mantém margem abaixo do limite de 4,5 MB das Vercel Functions.
const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

function getSession(request: NextRequest) {
  const isAdmin = verifyAdminToken(
    request.cookies.get(ADMIN_COOKIE_NAME)?.value,
  );
  const clientSession = verifyClientToken(
    request.cookies.get(CLIENT_COOKIE_NAME)?.value,
  );

  return { isAdmin, clientSession };
}

function sanitizePathPart(value: string, fallback: string) {
  return (
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || fallback
  );
}

function sanitizeFolder(value: string) {
  return (
    value
      .toLowerCase()
      .split('/')
      .map((part) => sanitizePathPart(part, ''))
      .filter(Boolean)
      .join('/')
      .slice(0, 120) || 'geral'
  );
}

function sanitizeFileName(value: string) {
  const extension = value
    .split('.')
    .pop()
    ?.toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  const baseName = sanitizePathPart(value.replace(/\.[^/.]+$/, ''), 'imagem');

  return extension ? `${baseName}.${extension}` : baseName;
}

export async function GET(request: NextRequest) {
  const { isAdmin, clientSession } = getSession(request);

  if (!isAdmin && !clientSession) {
    return NextResponse.json(
      { error: 'Sua sessão expirou. Entre novamente antes de enviar imagens.' },
      { status: 401 },
    );
  }

  const hasLegacyToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  const hasOidc = Boolean(
    process.env.VERCEL || process.env.VERCEL_OIDC_TOKEN,
  );

  if (!hasLegacyToken && !hasOidc) {
    return NextResponse.json(
      {
        error:
          'O Blob não está autenticado neste ambiente. No computador, execute: npx vercel link && npx vercel env pull .env.local. Depois reinicie o servidor.',
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ready: true,
    authentication: hasLegacyToken ? 'read-write-token' : 'oidc',
  });
}

export async function POST(request: NextRequest) {
  const { isAdmin, clientSession } = getSession(request);

  if (!isAdmin && !clientSession) {
    return NextResponse.json(
      { error: 'Sua sessão expirou. Entre novamente antes de enviar imagens.' },
      { status: 401 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = sanitizeFolder(String(formData.get('folder') || 'geral'));

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'Selecione uma imagem.' },
        { status: 400 },
      );
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Envie uma imagem JPG, PNG, WEBP ou GIF.' },
        { status: 400 },
      );
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        {
          error:
            'A imagem otimizada ultrapassou 4 MB. Escolha uma imagem menor ou reduza a resolução.',
        },
        { status: 413 },
      );
    }

    const fileName = sanitizeFileName(file.name);
    const pathname = `orbit/${folder}/${fileName}`;

    const blob = await put(pathname, file, {
      access: 'public',
      addRandomSuffix: true,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
      ...(process.env.BLOB_READ_WRITE_TOKEN
        ? { token: process.env.BLOB_READ_WRITE_TOKEN }
        : {}),
    });

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      uploadedBy: isAdmin ? 'admin' : 'client',
      workspaceId: clientSession?.workspaceId || null,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Não foi possível enviar a imagem.';

    console.error('[Vercel Blob server upload]', message);

    return NextResponse.json(
      {
        error:
          message.includes('token') || message.includes('OIDC')
            ? 'O Blob não conseguiu autenticar este ambiente. Reconecte o Blob ao projeto, use @vercel/blob atualizado e faça um novo deploy.'
            : message,
      },
      { status: 400 },
    );
  }
}
