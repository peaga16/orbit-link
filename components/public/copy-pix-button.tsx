'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

export function CopyPixButton({ pixKey, color }: { pixKey: string; color: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition hover:brightness-110"
      style={{ backgroundColor: color }}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Chave copiada' : 'Copiar chave Pix'}
    </button>
  );
}
