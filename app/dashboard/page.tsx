import Link from 'next/link';
import { ArrowUpRight, Eye, Link2, MousePointerClick, Pencil, TrendingUp } from 'lucide-react';
import { requireClientSession } from '@/lib/client-auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function formatNumber(value: number) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

export default async function ClientDashboardPage() {
  const session = requireClientSession();
  const workspace = await prisma.workspace.findUnique({
    where: { id: session.workspaceId },
    include: {
      links: { orderBy: [{ clicks: 'desc' }, { order: 'asc' }] },
      analytics: { orderBy: { createdAt: 'desc' }, take: 8 },
    },
  });

  if (!workspace) return null;

  const activeLinks = workspace.links.filter((link) => link.isActive).length;
  const clickRate = workspace.views > 0 ? (workspace.clicks / workspace.views) * 100 : 0;
  const stats = [
    { label: 'Visualizações', value: formatNumber(workspace.views), icon: Eye, detail: 'Visitas reais na página' },
    { label: 'Cliques', value: formatNumber(workspace.clicks), icon: MousePointerClick, detail: 'Acessos aos seus links' },
    { label: 'Taxa de clique', value: `${clickRate.toFixed(1)}%`, icon: TrendingUp, detail: 'Cliques por visualização' },
    { label: 'Links ativos', value: activeLinks, icon: Link2, detail: `${workspace.links.length} links cadastrados` },
  ];
  const maxLinkClicks = Math.max(...workspace.links.map((link) => link.clicks), 1);

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-3xl bg-[#0b0b0b] p-7 text-white shadow-xl sm:p-9">
        <div className="absolute inset-0 fine-grid opacity-40" />
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full blur-[80px]" style={{ backgroundColor: `${workspace.primaryColor}44` }} />
        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-red-400">{workspace.name}</div>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">Sua página, seus dados, seu controle.</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/45">Os números abaixo são registrados a partir das visitas e cliques na sua página pública.</p>
          </div>
          <Link href="/dashboard/editar" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500"><Pencil size={17} /> Editar minha página</Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="admin-card p-5">
            <div className="flex items-center justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600"><stat.icon size={20} /></div><span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600"><ArrowUpRight size={14} /> Ao vivo</span></div>
            <div className="mt-5 text-3xl font-bold tracking-tight text-slate-950">{stat.value}</div>
            <div className="mt-1 text-sm font-semibold text-slate-700">{stat.label}</div>
            <div className="mt-1 text-xs text-slate-400">{stat.detail}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <div className="admin-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-6"><div><h3 className="font-bold text-slate-950">Desempenho dos links</h3><p className="mt-1 text-xs text-slate-500">Cliques reais, do maior para o menor.</p></div><Link href="/dashboard/editar#links" className="text-sm font-semibold text-red-600">Editar links</Link></div>
          <div className="p-5 sm:p-6">
            <div className="space-y-5">
              {workspace.links.map((link) => (
                <div key={link.id}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm"><span className="truncate font-semibold text-slate-700">{link.title}</span><span className="text-xs font-bold text-slate-500">{formatNumber(link.clicks)} cliques</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-500" style={{ width: `${Math.max((link.clicks / maxLinkClicks) * 100, link.clicks ? 6 : 0)}%` }} /></div>
                </div>
              ))}
              {!workspace.links.length && <div className="rounded-xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-400">Adicione links para começar a medir os cliques.</div>}
            </div>
          </div>
        </div>

        <div className="admin-card overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6"><h3 className="font-bold text-slate-950">Atividade recente</h3><p className="mt-1 text-xs text-slate-500">Últimos eventos registrados.</p></div>
          <div>
            {workspace.analytics.map((event, index) => (
              <div key={event.id} className={`flex items-center gap-3 px-5 py-4 sm:px-6 ${index > 0 ? 'border-t border-slate-100' : ''}`}>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${event.eventType === 'click' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>{event.eventType === 'click' ? <MousePointerClick size={16} /> : <Eye size={16} />}</div>
                <div className="min-w-0 flex-1"><div className="text-sm font-semibold text-slate-800">{event.eventType === 'click' ? 'Clique em um link' : 'Nova visualização'}</div><div className="mt-1 text-xs text-slate-400">{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(event.createdAt)}</div></div>
              </div>
            ))}
            {!workspace.analytics.length && <div className="p-10 text-center text-sm text-slate-400">A atividade aparecerá quando a página receber acessos.</div>}
          </div>
        </div>
      </section>
    </div>
  );
}
