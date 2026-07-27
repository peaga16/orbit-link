'use client';

import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';
import Link from 'next/link';

const plan = {
  name: 'Plano Orbit',
  price: 29.9,
  description: 'Um preço fixo com todos os recursos essenciais.',
  features: [
    'Página profissional criada e publicada',
    'Painel exclusivo do cliente',
    'Links, imagens e Pix gerenciáveis',
    'Imagem de fundo personalizada',
    'Métricas reais de visitas e cliques',
    'Diretório público de clientes',
  ],
};

export function PricingPlans() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-[#070707] py-24 text-white">
      <div className="pointer-events-none absolute inset-0 fine-grid opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-400/10 blur-[150px]" />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
          <div className="text-xs font-bold uppercase tracking-[0.28em] text-red-300">Um único plano</div>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Simples, completo e com preço fixo.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-white/50">Sem níveis ou recursos bloqueados. O cliente recebe a página pronta e acesso ao painel.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="mx-auto mt-12 max-w-3xl rounded-[30px] border border-red-300/20 bg-gradient-to-br from-red-300/[0.09] via-white/[0.035] to-red-500/[0.08] p-1 shadow-glow">
          <div className="rounded-[26px] border border-white/10 bg-[#080808]/95 p-7 sm:p-10">
            <div className="grid gap-9 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-red-300/20 bg-red-300/10 px-3 py-1.5 text-xs font-semibold text-red-200"><Zap size={14} /> {plan.name}</div>
                <div className="mt-6 flex items-end gap-2"><span className="text-5xl font-black">R$ {plan.price.toFixed(2).replace('.', ',')}</span><span className="pb-1 text-sm text-white/40">/mês</span></div>
                <p className="mt-4 text-sm leading-6 text-white/45">{plan.description}</p>
                <Link href="/#contato" className="orbit-btn-primary mt-7 w-full sm:w-auto">Quero minha página</Link>
              </div>
              <div className="grid gap-3">
                {plan.features.map((feature) => <div key={feature} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white/70"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-300/15 text-red-300"><Check size={14} /></span>{feature}</div>)}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
