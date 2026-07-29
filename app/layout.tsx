import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import favicon from './favicon.png';
import './globals.css';

const tecna = localFont({
  src: [
    { path: '../public/fonts/tecnaregular.otf', weight: '400', style: 'normal' },
    { path: '../public/fonts/tecnademibold.otf', weight: '600', style: 'normal' },
    { path: '../public/fonts/tecnabold.otf', weight: '700', style: 'normal' },
    { path: '../public/fonts/tecnablack.otf', weight: '900', style: 'normal' },
  ],
  variable: '--font-tecna',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Orbit — Links, clientes e presença digital',
  description: 'Crie, gerencie e publique páginas profissionais para todos os seus clientes.',
  icons: {
    icon: favicon.src,
    shortcut: favicon.src,
    apple: favicon.src,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#070707',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={tecna.variable}>
      <body>{children}</body>
    </html>
  );
}
