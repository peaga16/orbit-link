import Link from 'next/link';
import { ArrowLeft, ArrowRight, Eye, Link2, MousePointerClick } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function formatNumber(value: number) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

export default async function PublicClientsPage() {
  const clients = await prisma.workspace.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      links: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
        take: 4,
      },
    },
  }).catch(() => []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070707] px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="pointer-events-none absolute inset-0 landing-grid opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(239,35,42,.22),transparent_62%)]" />
      <div className="pointer-events-none absolute -left-40 top-44 h-[420px] w-[420px] rounded-full bg-red-600/15 blur-[130px]" />
      <div className="pointer-events-none absolute -right-40 top-16 h-[420px] w-[420px] rounded-full bg-red-400/10 blur-[130px]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/[0.08] hover:text-white"><ArrowLeft size={16} /> Voltar</Link>
          <Link href="/cliente/login" className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-red-500">Área do cliente</Link>
        </div>

        <header className="mx-auto max-w-3xl py-20 text-center sm:py-24">
          <div className="text-xs font-bold uppercase tracking-[0.28em] text-red-500">Diretório público</div>
          <h1 className="mt-5 text-balance text-5xl font-semibold tracking-[-0.05em] sm:text-6xl">Todas as páginas da Orbit.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/48">Cada novo cliente cadastrado aparece automaticamente aqui com acesso direto à sua página pública.</p>
        </header>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {clients.map((client) => (
            <article key={client.id} className="group overflow-hidden rounded-[26px] border border-white/10 bg-[#0d0d0d] transition hover:-translate-y-1 hover:border-white/20">
              <div className="relative h-48 overflow-hidden bg-cover bg-center" style={{ backgroundImage: client.headerImage ? `linear-gradient(to top, rgba(0,0,0,.78), transparent), url(${client.headerImage})` : client.backgroundImage ? `linear-gradient(to top, rgba(0,0,0,.76), rgba(0,0,0,.2)), url(${client.backgroundImage})` : `linear-gradient(135deg, ${client.primaryColor}, ${client.secondaryColor})` }}>
                <div className="absolute inset-0 fine-grid opacity-30" />
                <div className="absolute bottom-5 left-5 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border-2 border-white/20 text-xl font-black text-white shadow-xl" style={{ backgroundColor: client.primaryColor }}>
                    {client.logo ? <img src={client.logo} alt="" className="h-full w-full object-cover" /> : client.name.charAt(0)}
                  </div>
                  <div><h2 className="text-xl font-bold">{client.name}</h2><p className="mt-1 text-xs text-white/55">/{client.slug}</p></div>
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <p className="line-clamp-2 min-h-12 text-sm leading-6 text-white/48">{client.description || client.title || 'Página profissional com os principais canais da marca.'}</p>
                <div className="mt-5 space-y-2">
                  {client.links.map((link) => (
                    <div key={link.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/10">{link.icon ? <img src={link.icon} alt="" className="h-full w-full object-cover" /> : <Link2 size={15} className="text-white/50" />}</div>
                      <span className="truncate text-sm font-medium text-white/75">{link.title}</span>
                    </div>
                  ))}
                  {!client.links.length && <div className="rounded-xl border border-dashed border-white/10 px-4 py-5 text-center text-xs text-white/30">Nenhum link publicado.</div>}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/[0.035] p-3"><div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-white/30"><Eye size={13} /> Visitas</div><div className="mt-2 text-lg font-bold">{formatNumber(client.views)}</div></div>
                  <div className="rounded-xl bg-white/[0.035] p-3"><div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-white/30"><MousePointerClick size={13} /> Cliques</div><div className="mt-2 text-lg font-bold">{formatNumber(client.clicks)}</div></div>
                </div>
                <Link href={`/${client.slug}`} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition hover:brightness-110" style={{ background: `linear-gradient(135deg, ${client.primaryColor}, ${client.secondaryColor})` }}>Acessar página <ArrowRight size={16} /></Link>
              </div>
            </article>
          ))}
        </section>

        {!clients.length && <div className="rounded-3xl border border-dashed border-white/15 p-16 text-center text-white/40">Nenhum cliente publicado ainda.</div>}

        <footer className="py-16 text-center text-xs text-white/25">© 2026 Orbit. Páginas profissionais de links.</footer>
      </div>
    </main>
  );
}
