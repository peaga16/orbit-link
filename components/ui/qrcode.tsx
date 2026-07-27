'use client';

import QRCode from 'qrcode';
import { useEffect, useRef } from 'react';

interface QRCodeComponentProps {
  value: string;
  size?: number;
}

export function QRCodeComponent({ value, size = 200 }: QRCodeComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        value,
        {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        },
        (error) => {
          if (error) console.error(error);
        }
      );
    }
  }, [value, size]);

  return <canvas ref={canvasRef} />;
}
