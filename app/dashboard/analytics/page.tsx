import { Eye, MousePointerClick, TrendingUp } from 'lucide-react';
import { requireClientSession } from '@/lib/client-auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default async function ClientAnalyticsPage() {
  const session = requireClientSession();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 6);

  const workspace = await prisma.workspace.findUnique({
    where: { id: session.workspaceId },
    include: {
      links: { orderBy: { clicks: 'desc' } },
      analytics: { where: { createdAt: { gte: start } }, orderBy: { createdAt: 'asc' } },
    },
  });
  if (!workspace) return null;

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const key = dayKey(date);
    return {
      key,
      label: new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit' }).format(date),
      views: workspace.analytics.filter((item) => item.eventType === 'view' && dayKey(item.createdAt) === key).length,
      clicks: workspace.analytics.filter((item) => item.eventType === 'click' && dayKey(item.createdAt) === key).length,
    };
  });
  const maxDaily = Math.max(...days.flatMap((day) => [day.views, day.clicks]), 1);
  const clickRate = workspace.views > 0 ? (workspace.clicks / workspace.views) * 100 : 0;

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold tracking-tight text-slate-950">Desempenho real</h2><p className="mt-1 text-sm text-slate-500">Visualizações e cliques registrados na sua página.</p></div>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Total de visitas', value: workspace.views.toLocaleString('pt-BR'), icon: Eye },
          { label: 'Total de cliques', value: workspace.clicks.toLocaleString('pt-BR'), icon: MousePointerClick },
          { label: 'Taxa de clique', value: `${clickRate.toFixed(1)}%`, icon: TrendingUp },
        ].map((stat) => <div key={stat.label} className="admin-card p-6"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600"><stat.icon size={20} /></div><div className="mt-5 text-3xl font-bold text-slate-950">{stat.value}</div><div className="mt-1 text-sm font-semibold text-slate-600">{stat.label}</div></div>)}
      </section>

      <section className="admin-card p-5 sm:p-7">
        <div><h3 className="font-bold text-slate-950">Últimos 7 dias</h3><p className="mt-1 text-xs text-slate-500">Dados agrupados por dia.</p></div>
        <div className="mt-8 grid h-72 grid-cols-7 items-end gap-2 sm:gap-4">
          {days.map((day) => (
            <div key={day.key} className="flex h-full flex-col justify-end gap-2">
              <div className="flex flex-1 items-end justify-center gap-1 sm:gap-2">
                <div title={`${day.views} visualizações`} className="w-3 rounded-t-md bg-slate-300 sm:w-5" style={{ height: `${Math.max((day.views / maxDaily) * 100, day.views ? 4 : 1)}%` }} />
                <div title={`${day.clicks} cliques`} className="w-3 rounded-t-md bg-red-600 sm:w-5" style={{ height: `${Math.max((day.clicks / maxDaily) * 100, day.clicks ? 4 : 1)}%` }} />
              </div>
              <div className="text-center text-[10px] font-semibold capitalize text-slate-400">{day.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-center gap-5 text-xs text-slate-500"><span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-slate-300" /> Visualizações</span><span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-red-600" /> Cliques</span></div>
      </section>

      <section className="admin-card overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6"><h3 className="font-bold text-slate-950">Cliques por link</h3></div>
        {workspace.links.map((link, index) => <div key={link.id} className={`flex items-center justify-between gap-4 px-5 py-4 sm:px-6 ${index > 0 ? 'border-t border-slate-100' : ''}`}><div className="min-w-0"><div className="truncate text-sm font-semibold text-slate-800">{link.title}</div><div className="mt-1 truncate text-xs text-slate-400">{link.url}</div></div><div className="shrink-0 text-right"><div className="text-lg font-bold text-slate-900">{link.clicks.toLocaleString('pt-BR')}</div><div className="text-[10px] text-slate-400">cliques</div></div></div>)}
        {!workspace.links.length && <div className="p-10 text-center text-sm text-slate-400">Nenhum link cadastrado.</div>}
      </section>
    </div>
  );
}
