'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

const cases = [
  {
    id: 'north-studio',
    name: 'North Studio',
    slug: 'northstudio',
    category: 'Agência Criativa',
    description: 'Agência de design especializada em identidade visual',
    image: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500&h=300&fit=crop',
    metrics: {
      growth: '+320%',
      links: '25+',
      clicks: '50k+',
    },
    stats: [
      { label: 'Crescimento', value: '+320%' },
      { label: 'Visitantes/mês', value: '12k' },
      { label: 'Taxa Conversão', value: '8.5%' },
    ],
    testimonial: 'LinkFlow transformou como compartilhamos nossos projetos. Perdemos o tempo com Linktree.',
    author: 'João Silva',
    role: 'Founder, North Studio',
  },
  {
    id: 'brena-bright',
    name: 'Brena Bright',
    slug: 'brena-bright',
    category: 'Limpeza Residencial',
    description: 'Serviço premium de limpeza para São Paulo',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695c952952?w=500&h=300&fit=crop',
    metrics: {
      growth: '+450%',
      links: '15+',
      clicks: '85k+',
    },
    stats: [
      { label: 'Crescimento', value: '+450%' },
      { label: 'Consultores', value: '38' },
      { label: 'Receita Pix', value: 'R$ 12k' },
    ],
    testimonial: 'Implementar LinkFlow foi a melhor decisão. Nossas conversões explodiram com o QR Code Pix.',
    author: 'Brena Costa',
    role: 'CEO, Brena Bright',
  },
];

export function ClientCaseStudies() {
  return (
    <section id="showcase" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Clientes de Sucesso
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Veja como empresas reais estão crescendo com LinkFlow
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {cases.map((caseStudy, index) => (
            <motion.div
              key={caseStudy.id}
              initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-red-300 hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden bg-gray-200">
                <img
                  src={caseStudy.image}
                  alt={caseStudy.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {caseStudy.name}
                  </h3>
                  <p className="text-red-300 font-medium text-sm">
                    {caseStudy.category}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  {caseStudy.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
                  {caseStudy.stats.map((stat, i) => (
                    <div key={i}>
                      <div className="text-xl font-bold text-red-600">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-500">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Testimonial */}
                <blockquote className="mb-6">
                  <p className="text-gray-700 italic mb-3">
                    "{caseStudy.testimonial}"
                  </p>
                  <footer className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                      {caseStudy.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {caseStudy.author}
                      </div>
                      <div className="text-xs text-gray-500">
                        {caseStudy.role}
                      </div>
                    </div>
                  </footer>
                </blockquote>

                {/* CTA */}
                <Link
                  href={`/${caseStudy.slug}`}
                  className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold group/link"
                >
                  Ver Página
                  <ExternalLink size={16} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
