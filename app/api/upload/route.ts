import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/admin-auth';
import { CLIENT_COOKIE_NAME, verifyClientToken } from '@/lib/client-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_IMAGE_SIZE = 12 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

function cleanEnv(value?: string) {
  if (!value) return '';

  return value
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .replace(/^BLOB_READ_WRITE_TOKEN\s*=\s*/i, '')
    .trim();
}

function getBlobToken() {
  return cleanEnv(process.env.BLOB_READ_WRITE_TOKEN);
}

function getSession(request: NextRequest) {
  const isAdmin = verifyAdminToken(
    request.cookies.get(ADMIN_COOKIE_NAME)?.value,
  );
  const clientSession = verifyClientToken(
    request.cookies.get(CLIENT_COOKIE_NAME)?.value,
  );

  return { isAdmin, clientSession };
}

function sanitizeFolder(value: string) {
  return (
    value
      .toLowerCase()
      .split('/')
      .map((part) => part.replace(/[^a-z0-9_-]/g, '').slice(0, 50))
      .filter(Boolean)
      .join('/')
      .slice(0, 120) || 'geral'
  );
}

/**
 * Verificação usada pelo componente antes de pedir o token de upload.
 * Não revela o token; apenas informa se a sessão e o Blob estão prontos.
 */
export async function GET(request: NextRequest) {
  const { isAdmin, clientSession } = getSession(request);

  if (!isAdmin && !clientSession) {
    return NextResponse.json(
      { error: 'Sua sessão expirou. Entre novamente antes de enviar imagens.' },
      { status: 401 },
    );
  }

  if (!getBlobToken()) {
    return NextResponse.json(
      {
        error:
          'BLOB_READ_WRITE_TOKEN não está disponível neste deployment. Conecte um Blob público ao projeto e faça um novo redeploy.',
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ready: true });
}

export async function POST(request: NextRequest) {
  const token = getBlobToken();

  if (!token) {
    return NextResponse.json(
      {
        error:
          'BLOB_READ_WRITE_TOKEN não está disponível neste deployment. Conecte o Vercel Blob ao projeto e faça um novo redeploy.',
      },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as HandleUploadBody;

    const response = await handleUpload({
      request,
      body,
      token,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const { isAdmin, clientSession } = getSession(request);

        if (!isAdmin && !clientSession) {
          throw new Error(
            'Sua sessão expirou. Entre novamente antes de enviar imagens.',
          );
        }

        let requestedFolder = 'geral';

        if (clientPayload) {
          try {
            const payload = JSON.parse(clientPayload) as { folder?: string };
            requestedFolder = payload.folder || 'geral';
          } catch {
            throw new Error('Dados do upload inválidos.');
          }
        }

        const safeFolder = sanitizeFolder(requestedFolder);
        const expectedPrefix = `orbit/${safeFolder}/`;

        if (!pathname.startsWith(expectedPrefix)) {
          throw new Error('Destino do upload inválido.');
        }

        return {
          allowedContentTypes: ALLOWED_IMAGE_TYPES,
          maximumSizeInBytes: MAX_IMAGE_SIZE,
          addRandomSuffix: true,
          cacheControlMaxAge: 60 * 60 * 24 * 365,
          tokenPayload: JSON.stringify({
            folder: safeFolder,
            workspaceId: clientSession?.workspaceId || null,
            uploadedBy: isAdmin ? 'admin' : 'client',
          }),
        };
      },
      onUploadCompleted: async () => {
        // A URL retornada pelo upload é salva quando o formulário é salvo.
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Não foi possível gerar o token de upload.';

    console.error('[Vercel Blob upload]', message);

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
