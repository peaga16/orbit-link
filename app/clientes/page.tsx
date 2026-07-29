import Link from 'next/link';
import { unstable_cache } from 'next/cache';
import { ArrowLeft, ArrowRight, Eye, Instagram, Link2, MousePointerClick } from 'lucide-react';
import { RemoteImage } from '@/components/ui/remote-image';
import { OrbitLogo } from '@/components/brand/orbit-logo';
import { ContactEmailButton } from '@/components/landing/contact-email-button';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

const getPublicClients = unstable_cache(
  async () => prisma.workspace.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      slug: true,
      title: true,
      description: true,
      primaryColor: true,
      secondaryColor: true,
      backgroundColor: true,
      backgroundImage: true,
      logo: true,
      headerImage: true,
      views: true,
      clicks: true,
      links: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
        take: 4,
        select: { id: true, title: true, icon: true },
      },
    },
  }).catch(() => []),
  ['public-clients-directory'],
  { revalidate: 60, tags: ['public-pages'] },
);

function formatNumber(value: number) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

export default async function PublicClientsPage() {
  const clients = await getPublicClients();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070707] px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="pointer-events-none absolute inset-0 landing-grid opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(239,35,42,.22),transparent_62%)]" />
      <div className="pointer-events-none absolute -left-40 top-44 h-[420px] w-[420px] rounded-full bg-red-600/15 blur-[70px] sm:blur-[130px]" />
      <div className="pointer-events-none absolute -right-40 top-16 h-[420px] w-[420px] rounded-full bg-red-400/10 blur-[70px] sm:blur-[130px]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="justify-self-start"><Link href="/" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/[0.08] hover:text-white sm:px-4"><ArrowLeft size={16} /> <span className="hidden sm:inline">Voltar</span></Link></div>
          <Link href="/" className="inline-flex items-center justify-self-center"><OrbitLogo variant="dark" size="medium" priority /></Link>
          <div className="justify-self-end"><Link href="/cliente/login" className="rounded-xl bg-red-600 px-3 py-2.5 text-sm font-semibold transition hover:bg-red-500 sm:px-4">Área do cliente</Link></div>
        </div>

        <header className="mx-auto max-w-3xl py-20 text-center sm:py-24">
          <div className="text-xs font-bold uppercase tracking-[0.28em] text-red-500">Diretório público</div>
          <h1 className="mt-5 text-balance text-5xl font-semibold tracking-[-0.05em] sm:text-6xl">Todas as páginas da Orbit.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/48">Cada novo cliente cadastrado aparece automaticamente aqui com acesso direto à sua página pública.</p>
        </header>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {clients.map((client) => (
            <article key={client.id} className="content-auto group overflow-hidden rounded-[26px] border border-white/10 bg-[#0d0d0d] transition hover:-translate-y-1 hover:border-white/20">
              <div className="relative h-48 overflow-hidden" style={!client.headerImage && !client.backgroundImage ? { background: `linear-gradient(135deg, ${client.primaryColor}, ${client.secondaryColor})` } : undefined}>
                {(client.headerImage || client.backgroundImage) && (
                  <RemoteImage
                    src={(client.headerImage || client.backgroundImage)!}
                    alt={`Capa de ${client.name}`}
                    fill
                    width={900}
                    height={384}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    quality={66}
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                )}
                {(client.headerImage || client.backgroundImage) && <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />}
                <div className="absolute inset-0 fine-grid opacity-30" />
                <div className="absolute bottom-5 left-5 flex items-center gap-3">
                  <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border-2 border-white/20 text-xl font-black text-white shadow-xl" style={{ backgroundColor: client.primaryColor }}>
                    {client.logo ? <RemoteImage src={client.logo} alt="" fill width={112} height={112} sizes="56px" quality={68} className="object-cover" /> : client.name.charAt(0)}
                  </div>
                  <div><h2 className="text-xl font-bold">{client.name}</h2><p className="mt-1 text-xs text-white/55">/{client.slug}</p></div>
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <p className="line-clamp-2 min-h-12 text-sm leading-6 text-white/48">{client.description || client.title || 'Página profissional com os principais canais da marca.'}</p>
                <div className="mt-5 space-y-2">
                  {client.links.map((link) => (
                    <div key={link.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2.5">
                      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/10">{link.icon ? <RemoteImage src={link.icon} alt="" fill width={72} height={72} sizes="36px" quality={62} className="object-cover" /> : <Link2 size={15} className="text-white/50" />}</div>
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

        <footer className="mt-16 border-t border-white/10 py-12">
          <div className="flex flex-col items-center justify-between gap-7 text-sm text-white/35 sm:flex-row">
            <div className="text-center sm:text-left"><OrbitLogo variant="dark" size="small" /><div className="mt-3 text-xs">© 2026 Orbit. Páginas profissionais de links.</div></div>
            <div className="flex flex-wrap items-center justify-center gap-5">
              <a href="https://www.instagram.com/orbit.bio/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition hover:text-red-300"><Instagram size={15} /> Instagram</a>
              <ContactEmailButton compact />
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
