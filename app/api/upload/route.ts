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

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as HandleUploadBody;

    const response = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const isAdmin = verifyAdminToken(
          request.cookies.get(ADMIN_COOKIE_NAME)?.value,
        );
        const clientSession = verifyClientToken(
          request.cookies.get(CLIENT_COOKIE_NAME)?.value,
        );

        if (!isAdmin && !clientSession) {
          throw new Error('Não autorizado. Entre novamente para enviar imagens.');
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
        };
      },
      onUploadCompleted: async () => {
        // A URL retornada pelo upload é salva no cadastro quando o formulário é salvo.
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Não foi possível enviar a imagem.';

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
