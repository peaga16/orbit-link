import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/admin-auth';
import { CLIENT_COOKIE_NAME, verifyClientToken } from '@/lib/client-auth';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const isAdmin = verifyAdminToken(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
  const clientSession = verifyClientToken(request.cookies.get(CLIENT_COOKIE_NAME)?.value);

  if (!isAdmin && !clientSession) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = String(formData.get('folder') || 'geral');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Selecione uma imagem.' }, { status: 400 });
    }

    const upload = await uploadImageToCloudinary(file, folder);
    return NextResponse.json(upload);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Não foi possível enviar a imagem.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
