import Link from 'next/link';
import { ArrowLeft, Orbit } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070707] px-5 text-white landing-grid">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 shadow-glow"><Orbit size={28} /></div>
        <div className="mt-7 text-xs font-bold uppercase tracking-[0.25em] text-red-400">Erro 404</div>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Página fora de órbita.</h1>
        <p className="mt-4 leading-7 text-white/45">Esse cliente não existe ou a página está temporariamente pausada.</p>
        <Link href="/" className="orbit-btn-primary mt-7"><ArrowLeft size={17} /> Voltar ao início</Link>
      </div>
    </main>
  );
}
