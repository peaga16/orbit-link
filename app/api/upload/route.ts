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
 * Verifica somente a sessão antes de iniciar o upload.
 * Stores novos do Vercel Blob usam OIDC automaticamente e, por isso,
 * não precisam expor BLOB_READ_WRITE_TOKEN no projeto.
 */
export async function GET(request: NextRequest) {
  const { isAdmin, clientSession } = getSession(request);

  if (!isAdmin && !clientSession) {
    return NextResponse.json(
      { error: 'Sua sessão expirou. Entre novamente antes de enviar imagens.' },
      { status: 401 },
    );
  }

  if (process.env.VERCEL && !process.env.BLOB_STORE_ID) {
    return NextResponse.json(
      {
        error:
          'O Vercel Blob não está conectado a este projeto ou ambiente. Conecte o store e faça um novo deploy.',
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ready: true, auth: 'oidc' });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as HandleUploadBody;

    const response = await handleUpload({
      request,
      body,
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
        : 'Não foi possível gerar a autorização de upload.';

    console.error('[Vercel Blob upload]', message);

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
