import Link from 'next/link';
import { SignUpButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            LinkFlow
          </Link>
          <SignUpButton>
            <button className="bg-red-600 text-white px-6 py-2 rounded-lg">
              Começar
            </button>
          </SignUpButton>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">
          LinkFlow - SaaS de Link in Bio
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Plataforma para criar páginas com links, QR Pix e analytics.
        </p>
        <SignUpButton>
          <button className="bg-red-600 text-white px-8 py-3 rounded-lg text-lg">
            Começar Agora
          </button>
        </SignUpButton>
      </main>
    </div>
  );
}