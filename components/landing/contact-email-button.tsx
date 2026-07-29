'use client';

import { Mail } from 'lucide-react';

const CONTACT_EMAIL = (process.env.NEXT_PUBLIC_ORBIT_CONTACT_EMAIL || '').trim();

export function ContactEmailButton({ compact = false, className = '' }: { compact?: boolean; className?: string }) {
  function openEmailClient() {
    if (!CONTACT_EMAIL) return;

    const subject = encodeURIComponent('Quero conhecer a Orbit');
    const body = encodeURIComponent('Olá! Gostaria de saber mais sobre a página profissional da Orbit.');
    window.location.assign(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`);
  }

  return (
    <button
      type="button"
      onClick={openEmailClient}
      disabled={!CONTACT_EMAIL}
      title={CONTACT_EMAIL ? 'Enviar e-mail para a Orbit' : 'E-mail em breve'}
      className={`${compact ? 'inline-flex items-center gap-2 transition hover:text-red-300 disabled:cursor-default disabled:opacity-60' : 'orbit-btn-secondary px-7 disabled:cursor-default disabled:opacity-60'} ${className}`}
    >
      <Mail size={compact ? 15 : 18} />
      {CONTACT_EMAIL ? 'E-mail' : 'E-mail em breve'}
    </button>
  );
}
