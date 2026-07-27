'use client';

import { motion } from 'framer-motion';
import { Link2, BarChart3, Zap, PieChart, Smartphone, Lock, Sparkles, Share2 } from 'lucide-react';

const features = [
  {
    icon: Link2,
    title: 'Links Ilimitados',
    description: 'Adicione quantos links quiser na sua página personalizada',
  },
  {
    icon: BarChart3,
    title: 'Analytics em Tempo Real',
    description: 'Acompanhe cliques, visualizações e origem do tráfego',
  },
  {
    icon: Smartphone,
    title: 'QR Code Pix',
    description: 'Receba pagamentos direto na sua página com QR Code',
  },
  {
    icon: Zap,
    title: 'NFC Tags',
    description: 'Conecte tags NFC para compartilhamento sem contato',
  },
  {
    icon: PieChart,
    title: 'Formulários Customizados',
    description: 'Crie formulários para capturar leads e contatos',
  },
  {
    icon: Sparkles,
    title: 'Temas Premium',
    description: 'Escolha entre templates profissionais ou crie o seu',
  },
  {
    icon: Share2,
    title: 'Integrações',
    description: 'Conecte com WhatsApp, Instagram, YouTube e mais',
  },
  {
    icon: Lock,
    title: 'Segurança Total',
    description: 'SSL, backup automático e proteção de dados LGPD',
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Recursos Poderosos
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tudo que você precisa para criar uma presença digital profissional
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-600 transition-all duration-300">
                <feature.icon className="text-red-600 group-hover:text-white transition-colors" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
