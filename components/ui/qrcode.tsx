import QRCode from 'qrcode';

interface QRCodeComponentProps {
  value: string;
  size?: number;
}

export async function QRCodeComponent({ value, size = 200 }: QRCodeComponentProps) {
  const svg = await QRCode.toString(value, {
    type: 'svg',
    width: size,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });

  return (
    <div
      aria-label="QR Code Pix"
      className="leading-none [&_svg]:block [&_svg]:h-auto [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
