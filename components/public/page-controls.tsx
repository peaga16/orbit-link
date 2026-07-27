'use client';

import Image from 'next/image';
import { Check, Copy, Download, Moon, Share2, Sun, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Appearance = 'light' | 'dark';

type PageControlsProps = {
  pageId: string;
  slug: string;
  pageName: string;
  initialAppearance?: Appearance;
};

export function PageControls({
  pageId,
  slug,
  pageName,
  initialAppearance = 'light',
}: PageControlsProps) {
  const [appearance, setAppearance] = useState<Appearance>(initialAppearance);
  const [shareOpen, setShareOpen] = useState(false);
  const [pageUrl, setPageUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const qrUrl = useMemo(
    () => pageUrl ? `/api/qr?value=${encodeURIComponent(pageUrl)}&size=640` : '',
    [pageUrl],
  );

  useEffect(() => {
    const saved = window.localStorage.getItem('orbit-public-appearance');
    const nextAppearance = saved === 'dark' || saved === 'light' ? saved : initialAppearance;
    setAppearance(nextAppearance);
    document.getElementById(pageId)?.setAttribute('data-appearance', nextAppearance);
    setPageUrl(window.location.href.split('#')[0]);
  }, [initialAppearance, pageId]);

  useEffect(() => {
    if (!shareOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShareOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [shareOpen]);

  function toggleAppearance() {
    const nextAppearance: Appearance = appearance === 'dark' ? 'light' : 'dark';
    setAppearance(nextAppearance);
    window.localStorage.setItem('orbit-public-appearance', nextAppearance);
    document.getElementById(pageId)?.setAttribute('data-appearance', nextAppearance);
  }

  async function copyLink() {
    if (!pageUrl) return;
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function sharePage() {
    if (!pageUrl) return;
    if (navigator.share) {
      await navigator.share({ title: pageName, url: pageUrl }).catch(() => undefined);
      return;
    }
    await copyLink();
  }

  async function downloadQrCode() {
    if (!qrUrl) return;
    setDownloading(true);
    try {
      const response = await fetch(qrUrl);
      if (!response.ok) throw new Error('Falha ao gerar o QR Code.');
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = `${slug}-qrcode.png`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleAppearance}
          className="orbit-public-control"
          aria-label={appearance === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
          title={appearance === 'dark' ? 'Modo claro' : 'Modo escuro'}
        >
          {appearance === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button
          type="button"
          onClick={() => setShareOpen(true)}
          className="orbit-public-control"
          aria-label="Compartilhar página"
          title="Compartilhar página"
        >
          <Share2 size={16} />
        </button>
      </div>

      {shareOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onMouseDown={() => setShareOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-dialog-title"
            className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0c10] text-white shadow-[0_30px_100px_rgba(0,0,0,.55)]"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-white/10 p-5 sm:p-6">
              <div>
                <h2 id="share-dialog-title" className="text-xl font-bold">Compartilhar página</h2>
                <p className="mt-1 text-sm text-white/45">Copie o link ou baixe o QR Code para divulgar.</p>
              </div>
              <button type="button" onClick={() => setShareOpen(false)} className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/60 transition hover:bg-white/10 hover:text-white" aria-label="Fechar">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Link público</div>
                <div className="flex items-center gap-2">
                  <input value={pageUrl} readOnly className="min-w-0 flex-1 bg-transparent text-sm text-white/75 outline-none" />
                  <button type="button" onClick={copyLink} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-500">
                    {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>

              <div className="mx-auto w-fit rounded-[24px] bg-white p-3 shadow-2xl">
                {qrUrl ? (
                  <Image src={qrUrl} alt={`QR Code da página ${pageName}`} width={260} height={260} unoptimized className="h-auto w-[220px] sm:w-[260px]" />
                ) : (
                  <div className="h-[220px] w-[220px] animate-pulse rounded-xl bg-slate-100 sm:h-[260px] sm:w-[260px]" />
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={sharePage} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold transition hover:bg-white/10">
                  <Share2 size={16} /> Compartilhar
                </button>
                <button type="button" onClick={downloadQrCode} disabled={downloading || !qrUrl} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60">
                  <Download size={16} /> {downloading ? 'Baixando...' : 'Baixar QR Code'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
