'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { OrbitLogo } from '@/components/brand/orbit-logo';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, LockKeyhole, Mail, Sparkles } from 'lucide-react';

export function ClientLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/client/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Não foi possível entrar.');

      router.replace(searchParams.get('next') || '/dashboard');
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Não foi possível entrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#080808]">
      <div className="relative hidden w-1/2 overflow-hidden border-r border-white/10 landing-grid lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,rgba(239,35,42,.24),transparent_55%)]" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition hover:text-white"><ArrowLeft size={16} /> Voltar ao site</Link>
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300"><Sparkles size={14} /> Área exclusiva do cliente</div>
            <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.05] tracking-[-0.045em] text-white">Sua página pronta. Seu conteúdo sempre atualizado.</h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-white/45">Edite textos, imagens, links e Pix sem depender de código e acompanhe números reais de visitas e cliques.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['Conteúdo', 'Imagens', 'Métricas'].map((item, index) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <div className="text-2xl font-bold text-white">0{index + 1}</div>
                <div className="mt-1 text-xs text-white/35">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-5 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-10 inline-flex items-center">
            <OrbitLogo variant="dark" size="large" priority />
          </Link>
          <div className="text-xs font-bold uppercase tracking-[0.24em] text-red-500">Painel do cliente</div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">Entre na sua página</h2>
          <p className="mt-3 text-sm leading-6 text-white/40">Use o e-mail e a senha enviados pelo administrador.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-white/70">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-xl border border-white/10 bg-white/[0.045] py-3.5 pl-12 pr-4 text-white outline-none transition placeholder:text-white/20 focus:border-red-500/50 focus:ring-4 focus:ring-red-500/10" placeholder="voce@empresa.com" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-white/70">Senha</label>
              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-xl border border-white/10 bg-white/[0.045] py-3.5 pl-12 pr-12 text-white outline-none transition placeholder:text-white/20 focus:border-red-500/50 focus:ring-4 focus:ring-red-500/10" placeholder="Sua senha" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white" aria-label="Mostrar senha">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>

            {error && <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

            <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <>Acessar meu painel <ArrowRight size={18} /></>}
            </button>
          </form>
          <p className="mt-8 text-center text-xs text-white/25">Problemas no acesso? Solicite uma nova senha ao administrador.</p>
        </div>
      </div>
    </div>
  );
}
