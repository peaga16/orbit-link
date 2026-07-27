import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const value = request.nextUrl.searchParams.get('value')?.trim() || '';
  const requestedSize = Number(request.nextUrl.searchParams.get('size') || 640);
  const size = Number.isFinite(requestedSize)
    ? Math.min(1200, Math.max(180, Math.round(requestedSize)))
    : 640;

  if (!value || value.length > 2048) {
    return NextResponse.json({ error: 'Conteúdo inválido para o QR Code.' }, { status: 400 });
  }

  try {
    const png = await QRCode.toBuffer(value, {
      type: 'png',
      width: size,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#050505',
        light: '#FFFFFF',
      },
    });

    return new NextResponse(new Uint8Array(png), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Não foi possível gerar o QR Code.' }, { status: 500 });
  }
}
