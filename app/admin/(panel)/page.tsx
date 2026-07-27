import Link from 'next/link';
import {
  ArrowUpRight,
  Eye,
  Link2,
  MousePointerClick,
  Plus,
  TrendingUp,
  Users,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function formatNumber(value: number) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

export default async function AdminDashboardPage() {
  let clients: Array<any> = [];
  let databaseError = false;

  try {
    clients = await prisma.workspace.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { links: true } } },
    });
  } catch {
    databaseError = true;
  }

  const activeClients = clients.length;
  const views = clients.reduce((total, client) => total + client.views, 0);
  const clicks = clients.reduce((total, client) => total + client.clicks, 0);
  const conversion = views > 0 ? (clicks / views) * 100 : 0;

  const stats = [
    { label: 'Clientes ativos', value: activeClients, icon: Users, detail: `${clients.length} cadastrados` },
    { label: 'Visualizações', value: formatNumber(views), icon: Eye, detail: 'Total das páginas' },
    { label: 'Cliques', value: formatNumber(clicks), icon: MousePointerClick, detail: 'Links acessados' },
    { label: 'Taxa de clique', value: `${conversion.toFixed(1)}%`, icon: TrendingUp, detail: 'Cliques por visita' },
  ];

  const maxViews = Math.max(...clients.map((client) => client.views), 1);

  return (
    <div className="space-y-7">
      {databaseError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          <strong>Banco ainda não preparado.</strong> No terminal, execute <code className="rounded bg-amber-100 px-1.5 py-1">npm run setup</code> para criar as tabelas e cadastrar os dois clientes iniciais.
        </div>
      )}

      <section className="relative overflow-hidden rounded-3xl bg-[#0b0b0b] p-7 text-white shadow-xl sm:p-9">
        <div className="absolute inset-0 fine-grid opacity-40" />
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-red-600/20 blur-[80px]" />
        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-red-400">Painel administrativo</div>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">Tudo que você precisa para gerenciar seus clientes.</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/45">Cadastre páginas, edite links, personalize a identidade e acompanhe a performance em um só lugar.</p>
          </div>
          <Link href="/admin/clientes/novo" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500"><Plus size={17} /> Cadastrar cliente</Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="admin-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600"><stat.icon size={20} /></div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600"><ArrowUpRight size={14} /> Ativo</span>
            </div>
            <div className="mt-5 text-3xl font-bold tracking-tight text-slate-950">{stat.value}</div>
            <div className="mt-1 text-sm font-semibold text-slate-700">{stat.label}</div>
            <div className="mt-1 text-xs text-slate-400">{stat.detail}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <div className="admin-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
            <div><h3 className="font-bold text-slate-950">Clientes recentes</h3><p className="mt-1 text-xs text-slate-500">Últimas páginas atualizadas.</p></div>
            <Link href="/admin/clientes" className="text-sm font-semibold text-red-600 hover:text-red-500">Ver todos</Link>
          </div>
          <div>
            {clients.slice(0, 5).map((client, index) => (
              <div key={client.id} className={`flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 ${index > 0 ? 'border-t border-slate-100' : ''}`}>
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl text-sm font-bold text-white" style={{ backgroundColor: client.primaryColor }}>
                    {client.logo ? <img src={client.logo} alt="" className="h-full w-full object-cover" /> : client.name.charAt(0)}
                  </div>
                  <div className="min-w-0"><div className="truncate font-semibold text-slate-900">{client.name}</div><div className="truncate text-xs text-slate-400">/{client.slug} · {client._count.links} links</div></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">ATIVO</span>
                  <Link href={`/admin/clientes/${client.id}`} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">Editar</Link>
                </div>
              </div>
            ))}
            {!clients.length && <div className="p-10 text-center text-sm text-slate-500">Nenhum cliente cadastrado.</div>}
          </div>
        </div>

        <div className="admin-card p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><h3 className="font-bold text-slate-950">Performance por cliente</h3><p className="mt-1 text-xs text-slate-500">Comparativo de visualizações.</p></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500"><BarChartIcon /></div></div>
          <div className="mt-7 space-y-5">
            {clients.slice(0, 5).map((client) => (
              <div key={client.id}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm"><span className="truncate font-semibold text-slate-700">{client.name}</span><span className="text-xs font-bold text-slate-500">{formatNumber(client.views)}</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-500" style={{ width: `${Math.max((client.views / maxViews) * 100, client.views ? 8 : 0)}%` }} /></div>
              </div>
            ))}
            {!clients.length && <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-400">Os dados aparecerão após o setup.</div>}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { href: '/admin/clientes/novo', icon: Plus, title: 'Novo cliente', text: 'Cadastre uma nova página do zero.' },
          { href: '/admin/clientes', icon: Link2, title: 'Gerenciar links', text: 'Abra um cliente para editar seus links.' },
          { href: '/', icon: Eye, title: 'Ver landing page', text: 'Confira o novo visual público do sistema.' },
        ].map((action) => (
          <Link key={action.title} href={action.href} className="admin-card group flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition group-hover:bg-red-50 group-hover:text-red-600"><action.icon size={20} /></div>
            <div><div className="font-bold text-slate-900">{action.title}</div><div className="mt-1 text-xs text-slate-500">{action.text}</div></div>
          </Link>
        ))}
      </section>
    </div>
  );
}

function BarChartIcon() {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M7 16v-5"/><path d="M12 16V8"/><path d="M17 16V5"/></svg>;
}
