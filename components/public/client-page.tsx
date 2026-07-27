'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Copy,
  ExternalLink,
  Eye,
  Link2,
  QrCode,
} from 'lucide-react';
import { QRCodeComponent } from '@/components/ui/qrcode';

type PublicClient = {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  description: string | null;
  theme: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  backgroundImage: string | null;
  fontFamily: string;
  logo: string | null;
  headerImage: string | null;
  showBranding: boolean;
  views: number;
  links: Array<{
    id: string;
    title: string;
    url: string;
    description: string | null;
    icon: string | null;
  }>;
  pixQRCodes: Array<{
    id: string;
    title: string;
    pixKey: string;
    amount: number | null;
    description: string | null;
  }>;
};

function contrastColor(hexColor: string) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16) || 255;
  const g = parseInt(hex.slice(2, 4), 16) || 255;
  const b = parseInt(hex.slice(4, 6), 16) || 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 155 ? '#111111' : '#FFFFFF';
}

export function ClientPublicPage({ client }: { client: PublicClient }) {
  const [copied, setCopied] = useState('');
  const hasBackgroundImage = Boolean(client.backgroundImage);
  const textColor = hasBackgroundImage ? '#FFFFFF' : contrastColor(client.backgroundColor);
  const mutedColor = textColor === '#FFFFFF' ? 'rgba(255,255,255,.58)' : 'rgba(17,17,17,.58)';
  const panelColor = hasBackgroundImage
    ? 'rgba(6,8,12,.72)'
    : textColor === '#FFFFFF'
      ? 'rgba(255,255,255,.065)'
      : 'rgba(255,255,255,.80)';
  const borderColor = textColor === '#FFFFFF' ? 'rgba(255,255,255,.12)' : 'rgba(17,17,17,.10)';

  async function copyPix(id: string, key: string) {
    try {
      await navigator.clipboard.writeText(key);
      setCopied(id);
      setTimeout(() => setCopied(''), 1800);
    } catch {
      setCopied('');
    }
  }

  return (
    <main
      className="relative min-h-screen overflow-hidden px-4 py-7 sm:px-6 sm:py-12"
      style={{ backgroundColor: client.backgroundColor, color: textColor, fontFamily: client.fontFamily }}
    >
      {client.backgroundImage && (
        <>
          <div
            className="pointer-events-none fixed inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${client.backgroundImage})` }}
          />
          <div className="pointer-events-none fixed inset-0 bg-black/65" />
          <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/80" />
        </>
      )}
      <div className="pointer-events-none fixed inset-0 fine-grid opacity-40" />
      <div className="pointer-events-none fixed -left-36 -top-32 h-96 w-96 rounded-full blur-[110px]" style={{ backgroundColor: client.primaryColor, opacity: .25 }} />
      <div className="pointer-events-none fixed -bottom-40 -right-40 h-96 w-96 rounded-full blur-[120px]" style={{ backgroundColor: client.secondaryColor, opacity: .20 }} />

      <div className="relative mx-auto max-w-xl">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold backdrop-blur-xl" style={{ backgroundColor: panelColor, border: `1px solid ${borderColor}` }}><ArrowLeft size={14} /> Orbit</Link>
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-semibold backdrop-blur-xl" style={{ backgroundColor: panelColor, border: `1px solid ${borderColor}`, color: mutedColor }}><Eye size={13} /> {client.views.toLocaleString('pt-BR')} visitas</div>
        </div>

        <section className="overflow-hidden rounded-[30px] shadow-[0_30px_100px_rgba(0,0,0,.35)] backdrop-blur-xl" style={{ backgroundColor: panelColor, border: `1px solid ${borderColor}` }}>
          <div
            className="relative h-44 bg-cover bg-center"
            style={{
              backgroundImage: client.headerImage
                ? `linear-gradient(to top, rgba(0,0,0,.65), transparent), url(${client.headerImage})`
                : `linear-gradient(135deg, ${client.primaryColor}, ${client.secondaryColor})`,
            }}
          >
            <div className="absolute inset-0 fine-grid opacity-30" />
          </div>

          <div className="relative px-5 pb-7 sm:px-7">
            <div className="mx-auto -mt-14 flex h-28 w-28 items-center justify-center overflow-hidden rounded-[28px] border-[6px] text-4xl font-black text-white shadow-2xl" style={{ borderColor: hasBackgroundImage ? '#0A0C10' : client.backgroundColor, backgroundColor: client.primaryColor }}>
              {client.logo ? <img src={client.logo} alt={client.name} className="h-full w-full object-cover" /> : client.name.charAt(0)}
            </div>

            <div className="mt-5 text-center">
              <h1 className="text-3xl font-black tracking-tight">{client.name}</h1>
              {client.title && <p className="mt-2 text-sm font-semibold" style={{ color: client.primaryColor }}>{client.title}</p>}
              {client.description && <p className="mx-auto mt-4 max-w-md text-sm leading-6" style={{ color: mutedColor }}>{client.description}</p>}
            </div>

            <div className="mt-7 space-y-3">
              {client.links.map((link) => (
                <a
                  key={link.id}
                  href={`/api/public/link/${link.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-2xl px-3.5 py-3.5 text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
                  style={{ background: `linear-gradient(135deg, ${client.primaryColor}, ${client.secondaryColor})` }}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/15">
                      {link.icon ? <img src={link.icon} alt="" className="h-full w-full object-cover" /> : <Link2 size={18} />}
                    </div>
                    <div className="min-w-0"><div className="truncate text-sm font-bold">{link.title}</div>{link.description && <div className="mt-1 truncate text-[11px] text-white/70">{link.description}</div>}</div>
                  </div>
                  <ChevronRight size={18} className="shrink-0 opacity-60 transition group-hover:translate-x-1" />
                </a>
              ))}
              {!client.links.length && <div className="rounded-2xl border border-dashed p-8 text-center text-sm" style={{ borderColor, color: mutedColor }}>Nenhum link disponível no momento.</div>}
            </div>

            {client.pixQRCodes.length > 0 && (
              <div className="mt-7 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: mutedColor }}><QrCode size={15} /> Pagamento</div>
                {client.pixQRCodes.map((pix) => (
                  <div key={pix.id} className="rounded-2xl p-5 backdrop-blur-xl" style={{ backgroundColor: panelColor, border: `1px solid ${borderColor}` }}>
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                      <div className="mx-auto overflow-hidden rounded-xl bg-white p-2 shadow-sm sm:mx-0"><QRCodeComponent value={pix.pixKey} size={126} /></div>
                      <div className="min-w-0 flex-1 text-center sm:text-left">
                        <h2 className="font-bold">{pix.title}</h2>
                        {pix.amount !== null && <div className="mt-1 text-lg font-black" style={{ color: client.primaryColor }}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pix.amount)}</div>}
                        {pix.description && <p className="mt-2 text-xs leading-5" style={{ color: mutedColor }}>{pix.description}</p>}
                        <button onClick={() => copyPix(pix.id, pix.pixKey)} className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition hover:brightness-110" style={{ backgroundColor: client.primaryColor }}>
                          {copied === pix.id ? <Check size={14} /> : <Copy size={14} />} {copied === pix.id ? 'Chave copiada' : 'Copiar chave Pix'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {client.showBranding && (
          <Link href="/" className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] opacity-40 transition hover:opacity-70">
            Criado com Orbit <ExternalLink size={11} />
          </Link>
        )}
      </div>
    </main>
  );
}
