'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { OrbitLogo } from '@/components/brand/orbit-logo';
import {
  BarChart3,
  ChevronRight,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Settings,
  Users,
  X,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Visão geral', icon: LayoutDashboard },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
  { href: '/admin/clientes/novo', label: 'Novo cliente', icon: Plus },
];

function Logo() {
  return <OrbitLogo variant="dark" size="medium" priority />;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const title = pathname === '/admin'
    ? 'Visão geral'
    : pathname === '/admin/clientes'
      ? 'Clientes'
      : pathname.includes('/novo')
        ? 'Novo cliente'
        : pathname.includes('/clientes/')
          ? 'Editar cliente'
          : 'Administrador';

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
        <Link href="/"><Logo /></Link>
        <button className="text-white/50 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Fechar menu"><X size={20} /></button>
      </div>
      <div className="flex-1 px-3 py-5">
        <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/25">Gerenciamento</div>
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const active = item.href === '/admin'
              ? pathname === '/admin'
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition ${
                  active
                    ? 'bg-red-600 text-white shadow-[0_10px_30px_rgba(239,35,42,.22)]'
                    : 'text-white/55 hover:bg-white/[0.055] hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3"><item.icon size={18} />{item.label}</span>
                {active && <ChevronRight size={15} />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/25">Atalhos</div>
        <div className="space-y-1.5">
          <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/55 transition hover:bg-white/[0.055] hover:text-white">
            <ExternalLink size={18} /> Abrir site
          </Link>
          <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/30">
            <Settings size={18} /> Configurações
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 p-3">
        <div className="mb-3 rounded-xl border border-white/10 bg-white/[0.035] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/15 text-sm font-bold text-red-300">A</div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white">Administrador</div>
              <div className="truncate text-[11px] text-white/35">Plano interno</div>
            </div>
          </div>
        </div>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/45 transition hover:bg-red-500/10 hover:text-red-300">
          <LogOut size={18} /> Sair do painel
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/10 bg-[#0a0a0a] lg:block">{sidebar}</aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} aria-label="Fechar menu" />
          <aside className="relative h-full w-72 bg-[#0a0a0a] shadow-2xl">{sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/85 px-4 backdrop-blur-xl sm:px-7">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="rounded-xl border border-slate-200 p-2.5 text-slate-600 lg:hidden" aria-label="Abrir menu"><Menu size={20} /></button>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">Orbit Admin</div>
              <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-950">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/clientes/novo" className="hidden items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500 sm:inline-flex">
              <Plus size={17} /> Novo cliente
            </Link>
          </div>
        </header>
        <main className="p-4 sm:p-7 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
