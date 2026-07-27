'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { BarChart3, ExternalLink, LayoutDashboard, LogOut, Menu, Pencil, X } from 'lucide-react';
import { RemoteImage } from '@/components/ui/remote-image';

const navItems = [
  { href: '/dashboard', label: 'Visão geral', icon: LayoutDashboard },
  { href: '/dashboard/editar', label: 'Editar página', icon: Pencil },
  { href: '/dashboard/analytics', label: 'Desempenho', icon: BarChart3 },
];

export function ClientShell({
  children,
  workspace,
}: {
  children: React.ReactNode;
  workspace: { name: string; slug: string; logo: string | null; primaryColor: string };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function logout() {
    await fetch('/api/client/logout', { method: 'POST' });
    router.replace('/cliente/login');
    router.refresh();
  }

  const title = pathname === '/dashboard'
    ? 'Visão geral'
    : pathname.includes('/editar')
      ? 'Editar página'
      : pathname.includes('/analytics')
        ? 'Desempenho'
        : 'Meu painel';

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-900"><div className="h-4 w-4 rounded-full border-2 border-white" /><div className="absolute h-7 w-7 rotate-45 rounded-full border border-white/50" /></div>
          <div><div className="text-base font-black tracking-[0.17em] text-white">ORBIT</div><div className="text-[8px] font-semibold uppercase tracking-[0.25em] text-red-400">Cliente</div></div>
        </Link>
        <button className="text-white/50 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Fechar menu"><X size={20} /></button>
      </div>
      <div className="flex-1 px-3 py-5">
        <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/25">Minha página</div>
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const active = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${active ? 'bg-red-600 text-white' : 'text-white/55 hover:bg-white/[0.055] hover:text-white'}`}>
                <item.icon size={18} /> {item.label}
              </Link>
            );
          })}
          <Link href={`/${workspace.slug}`} target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/55 transition hover:bg-white/[0.055] hover:text-white"><ExternalLink size={18} /> Ver página pública</Link>
        </nav>
      </div>
      <div className="border-t border-white/10 p-3">
        <div className="mb-3 rounded-xl border border-white/10 bg-white/[0.035] p-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl text-sm font-bold text-white" style={{ backgroundColor: workspace.primaryColor }}>
              {workspace.logo ? <RemoteImage src={workspace.logo} alt="" fill width={80} height={80} sizes="40px" quality={60} className="object-cover" /> : workspace.name.charAt(0)}
            </div>
            <div className="min-w-0"><div className="truncate text-sm font-semibold text-white">{workspace.name}</div><div className="truncate text-[11px] text-white/35">/{workspace.slug}</div></div>
          </div>
        </div>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/45 transition hover:bg-red-500/10 hover:text-red-300"><LogOut size={18} /> Sair do painel</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/10 bg-[#0a0a0a] lg:block">{sidebar}</aside>
      {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden"><button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} aria-label="Fechar menu" /><aside className="relative h-full w-72 bg-[#0a0a0a] shadow-2xl">{sidebar}</aside></div>}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/85 px-4 backdrop-blur-xl sm:px-7">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="rounded-xl border border-slate-200 p-2.5 text-slate-600 lg:hidden" aria-label="Abrir menu"><Menu size={20} /></button>
            <div><div className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">Painel do cliente</div><h1 className="mt-1 text-xl font-bold tracking-tight text-slate-950">{title}</h1></div>
          </div>
          <Link href={`/${workspace.slug}`} target="_blank" className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:inline-flex"><ExternalLink size={16} /> Abrir página</Link>
        </header>
        <main className="p-4 sm:p-7 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
