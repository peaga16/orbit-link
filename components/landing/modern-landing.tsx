import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  Eye,
  Globe2,
  Image as ImageIcon,
  Link2,
  MousePointerClick,
  Palette,
  Pencil,
  QrCode,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { RemoteImage } from '@/components/ui/remote-image';

export type LandingClient = {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  description: string | null;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  backgroundImage: string | null;
  logo: string | null;
  headerImage: string | null;
  views: number;
  clicks: number;
  links: Array<{ id: string; title: string; icon: string | null }>;
};

const features = [
  {
    icon: Sparkles,
    title: 'Página entregue pronta',
    description: 'A estrutura, o visual e a publicação são preparados para a identidade da sua marca.',
  },
  {
    icon: Pencil,
    title: 'Editor exclusivo',
    description: 'Depois da entrega, você altera textos, links, imagens, fundo e Pix no próprio painel.',
  },
  {
    icon: ImageIcon,
    title: 'Imagens em cada link',
    description: 'Envie capas, fotos, logos, fundos e imagens dos botões diretamente do computador.',
  },
  {
    icon: BarChart3,
    title: 'Métricas reais',
    description: 'Acompanhe visualizações, cliques, taxa de acesso e desempenho de cada link.',
  },
];

const planFeatures = [
  'Página profissional criada e publicada',
  'Painel exclusivo para editar conteúdo',
  'Links, imagens e Pix gerenciáveis',
  'Imagem de fundo em toda a página',
  'Métricas reais de visitas e cliques',
  'Entrada automática no diretório público',
];

function formatNumber(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    notation: value >= 10000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value);
}

function OrbitLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-red-300/30 bg-gradient-to-br from-red-500 via-red-600 to-red-900 shadow-[0_0_34px_rgba(239,35,42,.28)]">
        <div className="absolute inset-x-1 top-0 h-px bg-white/80" />
        <div className="h-4 w-4 rounded-full border-2 border-white" />
        <div className="absolute h-7 w-7 rotate-45 rounded-full border border-white/55" />
      </div>
      {!compact && (
        <div className="leading-none">
          <div className="text-lg font-black tracking-[0.18em] text-white">ORBIT</div>
          <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-red-300">Links profissionais</div>
        </div>
      )}
    </div>
  );
}

function PagePreview({ client }: { client?: LandingClient }) {
  const primary = client?.primaryColor || '#EF232A';
  const secondary = client?.secondaryColor || '#9F0D12';
  const background = client?.backgroundColor || '#070707';
  const links = client?.links?.slice(0, 4) || [
    { id: '1', title: 'Conheça nosso trabalho', icon: null },
    { id: '2', title: 'Fale pelo WhatsApp', icon: null },
    { id: '3', title: 'Veja nosso portfólio', icon: null },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[390px] rounded-[36px] border border-red-200/10 bg-[#111111] p-3 shadow-[0_40px_120px_rgba(0,0,0,.78),0_0_65px_rgba(239,35,42,.08)]">
      <div className="relative min-h-[620px] overflow-hidden rounded-[27px]" style={{ backgroundColor: background }}>
        {client?.backgroundImage && (
          <>
            <RemoteImage src={client.backgroundImage} alt="" fill priority width={780} height={1240} sizes="390px" quality={65} className="object-cover" />
            <div className="absolute inset-0 bg-black/65" />
          </>
        )}
        <div className="absolute inset-0 fine-grid opacity-45" />
        <div className="relative p-5">
          <div className="relative h-36 overflow-hidden rounded-2xl" style={!client?.headerImage ? { background: `linear-gradient(135deg, ${primary}, ${secondary})` } : undefined}>
            {client?.headerImage && <RemoteImage src={client.headerImage} alt="" fill priority width={780} height={288} sizes="390px" quality={68} className="object-cover" />}
            {client?.headerImage && <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />}
          </div>
          <div className="relative mx-auto -mt-11 flex h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-3xl border-4 border-[#111111] text-2xl font-black text-white shadow-xl" style={{ backgroundColor: primary }}>
            {client?.logo ? <RemoteImage src={client.logo} alt="" fill width={176} height={176} sizes="88px" quality={70} className="object-cover" /> : (client?.name?.charAt(0) || 'O')}
          </div>
          <div className="mt-4 text-center text-white">
            <h3 className="text-2xl font-black">{client?.name || 'Sua marca'}</h3>
            <p className="mt-2 text-xs font-semibold" style={{ color: primary }}>{client?.title || 'Tudo que importa em um só lugar'}</p>
          </div>
          <div className="mt-6 space-y-3">
            {links.map((link) => (
              <div key={link.id} className="flex items-center justify-between rounded-2xl p-3.5 text-sm font-semibold text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}>
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/15">
                    {link.icon ? <RemoteImage src={link.icon} alt="" fill width={88} height={88} sizes="44px" quality={65} className="object-cover" /> : <Link2 size={17} />}
                  </div>
                  <span className="truncate">{link.title}</span>
                </div>
                <ChevronRight size={16} className="opacity-60" />
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/35 p-4 text-center text-white backdrop-blur-xl">
            <QrCode className="mx-auto" size={28} style={{ color: primary }} />
            <div className="mt-2 text-xs font-bold">Pagamento via Pix</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricsPanel({ clients, stats }: { clients: LandingClient[]; stats: { clients: number; views: number; clicks: number } }) {

  return (
    <div className="relative mx-auto mt-16 max-w-6xl px-4 sm:px-6">
      <div className="absolute -inset-20 -z-10 orbit-glow animate-orbit-pulse" />
      <div className="overflow-hidden rounded-[28px] border border-red-200/10 bg-[#0d0d0d] shadow-[0_40px_120px_rgba(0,0,0,.7)]">
        <div className="flex h-12 items-center gap-2 border-b border-white/10 bg-black/45 px-5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <div className="ml-4 h-6 flex-1 rounded-lg border border-white/10 bg-white/[0.035]" />
        </div>
        <div className="grid min-h-[410px] grid-cols-12">
          <aside className="col-span-2 hidden border-r border-white/10 bg-black/20 p-5 md:block">
            <OrbitLogo compact />
            <div className="mt-10 space-y-3">
              {['Visão geral', 'Editar página', 'Desempenho'].map((item, index) => (
                <div key={item} className={`rounded-lg px-3 py-2.5 text-xs font-medium ${index === 0 ? 'bg-red-600 text-white' : 'text-white/45'}`}>{item}</div>
              ))}
            </div>
          </aside>
          <div className="col-span-12 p-5 sm:p-7 md:col-span-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-300">Painel do cliente</p>
              <h3 className="mt-2 text-2xl font-bold text-white">Conteúdo e resultados no mesmo lugar.</h3>
              <p className="mt-2 text-sm text-white/40">Números atualizados a partir dos acessos nas páginas publicadas.</p>
            </div>
            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {[
                ['Páginas publicadas', formatNumber(stats.clients), Globe2],
                ['Visualizações reais', formatNumber(stats.views), Eye],
                ['Cliques registrados', formatNumber(stats.clicks), MousePointerClick],
              ].map(([label, value, Icon]) => {
                const StatIcon = Icon as typeof Eye;
                return (
                  <div key={String(label)} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                    <div className="flex items-center justify-between"><div className="text-xs text-white/45">{String(label)}</div><StatIcon size={16} className="text-red-300" /></div>
                    <div className="mt-3 text-3xl font-bold text-white">{String(value)}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-white/10 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35"><span>Página</span><span>Visitas</span><span>Status</span></div>
              {clients.slice(0, 3).map((client, index) => (
                <div key={client.id} className={`grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-4 ${index ? 'border-t border-white/10' : ''}`}>
                  <div className="flex min-w-0 items-center gap-3"><div className="relative h-9 w-9 overflow-hidden rounded-xl" style={{ backgroundColor: client.primaryColor }}>{client.logo && <RemoteImage src={client.logo} alt="" fill width={72} height={72} sizes="36px" quality={65} className="object-cover" />}</div><span className="truncate text-sm font-medium text-white/75">{client.name}</span></div>
                  <span className="text-xs font-semibold text-white/55">{formatNumber(client.views)}</span>
                  <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300">ONLINE</span>
                </div>
              ))}
              {!clients.length && <div className="px-5 py-12 text-center text-sm text-white/35">Os clientes publicados aparecerão aqui.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ModernLanding({ clients, stats }: { clients: LandingClient[]; stats: { clients: number; views: number; clicks: number } }) {
  const featured = clients[0];

  return (
    <main className="min-h-screen overflow-hidden bg-[#070707] text-white">
      <section className="relative min-h-screen border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 landing-grid opacity-70" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(circle_at_50%_0%,rgba(239,35,42,.20),transparent_56%)]" />
        <div className="pointer-events-none absolute -left-40 top-32 h-[520px] w-[520px] rounded-full bg-red-700/15 blur-[80px] sm:blur-[150px]" />
        <div className="pointer-events-none absolute right-[-180px] top-16 h-[520px] w-[520px] rounded-full bg-red-400/10 blur-[80px] sm:blur-[145px]" />
        <div className="pointer-events-none absolute left-1/2 top-24 h-px w-[80%] -translate-x-1/2 tech-beam animate-orbit-scan opacity-60" />

        <div className="relative z-20 mx-auto max-w-6xl px-4 pt-5 sm:px-6">
          <nav className="flex h-16 items-center justify-between rounded-2xl border border-red-200/10 bg-black/75 px-4 shadow-2xl backdrop-blur-xl sm:px-6">
            <Link href="/"><OrbitLogo /></Link>
            <div className="hidden items-center gap-7 text-sm font-medium text-white/65 md:flex">
              <a href="#beneficios" className="transition hover:text-red-300">Benefícios</a>
              <Link href="/clientes" className="transition hover:text-red-300">Páginas</Link>
              <a href="#processo" className="transition hover:text-red-300">Como funciona</a>
              <a href="#plano" className="transition hover:text-red-300">Plano</a>
              <a href="#contato" className="transition hover:text-red-300">Contato</a>
            </div>
            <div className="hidden items-center gap-2 md:flex"><Link href="/cliente/login" className="orbit-btn-secondary px-4 py-2.5 text-sm">Área do cliente</Link></div>
            <details className="group relative md:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-center rounded-xl border border-white/10 px-3 py-2.5 text-sm font-semibold text-white/70">Menu</summary>
              <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-red-200/10 bg-black/95 p-4 shadow-2xl backdrop-blur-lg">
                <div className="grid gap-1 text-sm">
                  <a href="#beneficios" className="rounded-lg px-3 py-3 text-white/70">Benefícios</a>
                  <Link href="/clientes" className="rounded-lg px-3 py-3 text-white/70">Todas as páginas</Link>
                  <a href="#processo" className="rounded-lg px-3 py-3 text-white/70">Como funciona</a>
                  <a href="#plano" className="rounded-lg px-3 py-3 text-white/70">Plano</a>
                  <Link href="/cliente/login" className="mt-2 rounded-xl bg-red-500 px-4 py-3 text-center font-semibold text-white">Área do cliente</Link>
                </div>
              </div>
            </details>
          </nav>
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pb-10 pt-20 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:pt-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-300/20 bg-red-300/10 px-3 py-1.5 text-xs font-semibold text-red-200"><span className="h-1.5 w-1.5 rounded-full bg-red-300 shadow-[0_0_12px_rgba(239,35,42,.95)]" /> Sua página pronta para usar</div>
            <h1 className="mt-7 text-balance text-5xl font-semibold leading-[.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">Uma página profissional para reunir <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-700 bg-clip-text text-transparent">tudo da sua marca.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-white/50">Você recebe a página criada, personalizada e publicada. Depois, entra no seu painel apenas para atualizar conteúdo, imagens, links e acompanhar os resultados.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href="/clientes" className="orbit-btn-primary min-w-[190px] py-3.5">Conhecer as páginas <ArrowRight size={18} /></Link><Link href="/cliente/login" className="orbit-btn-secondary min-w-[190px] py-3.5">Acessar meu painel <ChevronRight size={18} /></Link></div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/40">{['Página criada para você', 'Editor simples', 'Métricas reais'].map((item) => <span key={item} className="inline-flex items-center gap-2"><Check size={14} className="text-red-300" /> {item}</span>)}</div>
          </div>
          <div className="relative"><div className="absolute inset-0 orbit-glow animate-orbit-pulse" /><div className="relative animate-orbit-float"><PagePreview client={featured} /></div></div>
        </div>

        <MetricsPanel clients={clients} stats={stats} />
        <div className="h-20" />
      </section>

      <section id="beneficios" className="content-auto relative border-b border-white/10 px-4 py-24 sm:px-6">
        <div className="pointer-events-none absolute inset-0 fine-grid opacity-40" />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end"><div><div className="text-xs font-bold uppercase tracking-[0.28em] text-red-300">Feito para sua marca</div><h2 className="mt-4 max-w-xl text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">Você cuida do conteúdo. A estrutura já está pronta.</h2></div><p className="max-w-xl text-base leading-7 text-white/50 lg:justify-self-end">Sem precisar contratar um site novo para cada atualização. A página nasce personalizada e continua fácil de manter pelo painel do cliente.</p></div>
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{features.map((feature, index) => <div key={feature.title} className="group rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition hover:-translate-y-1 hover:border-red-300/30 hover:bg-red-300/[0.035]"><div className="flex items-center justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-300/20 bg-red-300/10 text-red-300"><feature.icon size={21} /></div><span className="text-xs font-semibold text-white/20">0{index + 1}</span></div><h3 className="mt-6 text-lg font-semibold">{feature.title}</h3><p className="mt-3 text-sm leading-6 text-white/45">{feature.description}</p></div>)}</div>
        </div>
      </section>

      <section className="content-auto px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><div className="text-xs font-bold uppercase tracking-[0.28em] text-red-300">Páginas publicadas</div><h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">Conheça quem já está na Orbit.</h2><p className="mt-5 max-w-2xl text-white/50">Todo novo cliente cadastrado aparece automaticamente na vitrine pública.</p></div><Link href="/clientes" className="orbit-btn-secondary shrink-0">Ver todos os clientes <ArrowRight size={17} /></Link></div>
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {clients.slice(0, 4).map((client) => (
              <article key={client.id} className="group overflow-hidden rounded-[26px] border border-white/10 bg-[#0d0d0d] transition hover:border-red-200/20">
                <div className="relative min-h-[370px] overflow-hidden p-6 sm:p-8" style={!client.backgroundImage ? { background: `linear-gradient(145deg, ${client.backgroundColor}, #070707)` } : undefined}>
                  {client.backgroundImage && <RemoteImage src={client.backgroundImage} alt="" fill width={1000} height={740} sizes="(max-width: 1024px) 100vw, 50vw" quality={65} className="object-cover" />}
                  {client.backgroundImage && <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />}
                  <div className="absolute inset-0 fine-grid opacity-25" />
                  <div className="relative z-10 mx-auto max-w-sm rounded-[28px] border border-white/10 bg-black/45 p-5 shadow-2xl backdrop-blur-xl transition duration-500 group-hover:-translate-y-2">
                    <div className="relative h-24 overflow-hidden rounded-2xl" style={!client.headerImage ? { background: `linear-gradient(135deg, ${client.primaryColor}, ${client.secondaryColor})` } : undefined}>{client.headerImage && <RemoteImage src={client.headerImage} alt="" fill width={700} height={192} sizes="384px" quality={65} className="object-cover" />}{client.headerImage && <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />}</div>
                    <div className="relative mx-auto -mt-8 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-4 border-[#111111] text-xl font-black text-white" style={{ backgroundColor: client.primaryColor }}>{client.logo ? <RemoteImage src={client.logo} alt="" fill width={128} height={128} sizes="64px" quality={65} className="object-cover" /> : client.name.charAt(0)}</div>
                    <div className="mt-3 text-center"><h3 className="text-xl font-bold">{client.name}</h3><p className="mt-1 text-xs text-white/45">{client.title || `/${client.slug}`}</p></div>
                    <div className="mt-5 space-y-2.5">{client.links.slice(0, 3).map((link) => <div key={link.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.055] px-3 py-3 text-sm font-medium"><div className="flex min-w-0 items-center gap-2"><div className="relative h-8 w-8 overflow-hidden rounded-lg bg-white/10">{link.icon && <RemoteImage src={link.icon} alt="" fill width={64} height={64} sizes="32px" quality={60} className="object-cover" />}</div><span className="truncate">{link.title}</span></div><ChevronRight size={15} className="text-white/35" /></div>)}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-5 border-t border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7"><div><div className="text-xl font-semibold">{client.name}</div><p className="mt-2 max-w-md text-sm leading-6 text-white/45">{client.description || 'Página profissional com os principais canais da marca.'}</p></div><Link href={`/${client.slug}`} target="_blank" className="orbit-btn-secondary shrink-0">Abrir página <ArrowRight size={16} /></Link></div>
              </article>
            ))}
            {!clients.length && <div className="lg:col-span-2 rounded-3xl border border-dashed border-white/15 p-16 text-center text-white/45">Nenhuma página publicada ainda.</div>}
          </div>
        </div>
      </section>

      <section id="processo" className="content-auto border-y border-white/10 bg-[#0a0a0a] px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl"><div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center"><div><div className="inline-flex items-center gap-2 rounded-full border border-red-300/20 bg-red-300/10 px-3 py-1.5 text-xs font-semibold text-red-200"><ShieldCheck size={14} /> Serviço completo</div><h2 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">Você não precisa montar o sistema. Você recebe a página pronta.</h2><p className="mt-5 max-w-lg leading-7 text-white/50">A criação fica com a Orbit. O painel serve para manter a página sempre atualizada, sem depender de alterações técnicas.</p></div><div className="space-y-3">{[[Palette, 'Definimos o visual', 'Organizamos identidade, cores, imagens e estrutura de acordo com sua marca.'], [Globe2, 'Criamos e publicamos', 'Sua página recebe um endereço público e já chega pronta para compartilhar.'], [Pencil, 'Você mantém o conteúdo', 'Entre no painel para trocar links, imagens, fundo, textos, Pix e acompanhar métricas.']].map(([Icon, title, description], index) => { const StepIcon = Icon as typeof Palette; return <div key={String(title)} className="flex gap-5 rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-800 text-white shadow-[0_0_30px_rgba(239,35,42,.18)]"><StepIcon size={21} /></div><div><div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/25">Etapa 0{index + 1}</div><h3 className="mt-2 text-lg font-semibold">{String(title)}</h3><p className="mt-2 text-sm leading-6 text-white/45">{String(description)}</p></div></div>; })}</div></div></div>
      </section>

      <section id="plano" className="content-auto relative overflow-hidden px-4 py-24 sm:px-6">
        <div className="pointer-events-none absolute inset-0 fine-grid opacity-35" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-400/10 blur-[80px] sm:blur-[150px]" />
        <div className="relative mx-auto max-w-5xl">
          <div className="text-center"><div className="text-xs font-bold uppercase tracking-[0.28em] text-red-300">Um único plano</div><h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">Tudo o que sua página precisa, sem escolhas complicadas.</h2><p className="mx-auto mt-5 max-w-2xl text-white/50">Por enquanto, a Orbit trabalha com um preço fixo e todos os recursos essenciais inclusos.</p></div>
          <div className="relative mx-auto mt-12 max-w-3xl overflow-hidden rounded-[30px] border border-red-300/20 bg-gradient-to-br from-red-300/[0.09] via-white/[0.035] to-red-500/[0.08] p-1 shadow-glow">
            <div className="rounded-[26px] border border-white/10 bg-[#080808]/95 p-7 backdrop-blur-xl sm:p-10">
              <div className="grid gap-9 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-red-300/20 bg-red-300/10 px-3 py-1.5 text-xs font-semibold text-red-200"><Zap size={14} /> Plano Orbit</div>
                  <div className="mt-6 flex items-end gap-2"><span className="text-5xl font-black tracking-tight">R$ 29,90</span><span className="pb-1 text-sm text-white/40">/mês</span></div>
                  <p className="mt-4 text-sm leading-6 text-white/45">Preço fixo para receber sua página e manter o acesso ao painel de gerenciamento.</p>
                  <a href="#contato" className="orbit-btn-primary mt-7 w-full sm:w-auto">Quero minha página <ArrowRight size={18} /></a>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {planFeatures.map((feature) => <div key={feature} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white/70"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-300/15 text-red-300"><Check size={14} /></div>{feature}</div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contato" className="content-auto relative px-4 py-24 sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,35,42,.15),transparent_55%)]" />
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[30px] border border-red-300/20 bg-gradient-to-br from-[#27090b] via-[#14090a] to-[#07070a] p-8 text-center shadow-glow sm:p-14">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-red-600/20 blur-[65px] sm:blur-[90px]" />
          <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-300/30 bg-red-600 text-white shadow-[0_0_36px_rgba(239,35,42,.25)]"><MousePointerClick size={25} /></div>
          <h2 className="relative mx-auto mt-6 max-w-2xl text-balance text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Sua marca merece mais do que uma lista comum de links.</h2>
          <p className="relative mx-auto mt-5 max-w-xl leading-7 text-white/50">Tenha uma página criada para o seu negócio, com acesso próprio para manter tudo atualizado.</p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/clientes" className="orbit-btn-primary px-7">Ver páginas publicadas <ArrowRight size={18} /></Link><Link href="/cliente/login" className="orbit-btn-secondary px-7">Área do cliente</Link></div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-4 py-8 sm:px-6"><div className="mx-auto flex max-w-6xl flex-col gap-5 text-sm text-white/35 sm:flex-row sm:items-center sm:justify-between"><OrbitLogo /><div>© 2026 Orbit. Páginas profissionais de links.</div><div className="flex gap-5"><Link href="/clientes" className="hover:text-red-300">Clientes</Link><Link href="/cliente/login" className="hover:text-red-300">Entrar</Link></div></div></footer>
    </main>
  );
}
