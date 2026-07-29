'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { OrbitLogo } from '@/components/brand/orbit-logo';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, LockKeyhole, Mail } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('admin@orbitlink.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Não foi possível entrar.');

      router.replace(searchParams.get('next') || '/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#080808]">
      <div className="relative hidden w-1/2 overflow-hidden border-r border-white/10 landing-grid lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,rgba(239,35,42,.24),transparent_52%)]" />
        <div className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-red-600/20 blur-[100px]" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition hover:text-white"><ArrowLeft size={16} /> Voltar ao site</Link>
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300"><LockKeyhole size={14} /> Ambiente administrativo</div>
            <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.05] tracking-[-0.045em] text-white">Gerencie cada cliente sem sair da sua órbita.</h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-white/45">Cadastre páginas, organize links, personalize a identidade e acompanhe o desempenho em um painel moderno.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['Clientes', 'Links', 'Métricas'].map((item, index) => (
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
          <Link href="/" className="mb-10 inline-flex items-center lg:hidden">
            <OrbitLogo variant="dark" size="large" priority />
          </Link>
          <div className="text-xs font-bold uppercase tracking-[0.24em] text-red-500">Bem-vindo de volta</div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">Acesse o administrador</h2>
          <p className="mt-3 text-sm leading-6 text-white/40">Use as credenciais administrativas configuradas no arquivo <code className="rounded bg-white/5 px-1.5 py-1 text-white/60">.env</code>.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-white/70">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-xl border border-white/10 bg-white/[0.045] py-3.5 pl-12 pr-4 text-white outline-none transition placeholder:text-white/20 focus:border-red-500/50 focus:ring-4 focus:ring-red-500/10" placeholder="admin@orbitlink.com" />
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
              {loading ? <Loader2 className="animate-spin" size={18} /> : <>Entrar no painel <ArrowRight size={18} /></>}
            </button>
          </form>
          <p className="mt-8 text-center text-xs text-white/25">Altere a senha padrão antes de publicar o projeto.</p>
        </div>
      </div>
    </div>
  );
}
