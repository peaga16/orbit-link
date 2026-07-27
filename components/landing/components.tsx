'use client';

import { motion } from 'framer-motion';
import { SignUpButton } from '@clerk/nextjs';

export function TemplateShowcase() {
  return (
    <section id="showcase" className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Templates Profissionais
          </h2>
          <p className="text-xl text-gray-600">
            Escolha entre 20+ templates ou crie o seu do zero
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {['Moderno', 'Minimalista', 'Vibrante'].map((template, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300"></div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2">{template}</h3>
                <button className="text-red-600 hover:text-red-700 font-semibold text-sm">
                  Ver Mais →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Crie sua central de presença digital em minutos. Sem cartão de crédito necessário.
          </p>
          <SignUpButton mode="modal">
            <button className="bg-white text-red-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition transform hover:scale-105 duration-300">
              Começar Grátis Agora
            </button>
          </SignUpButton>
        </motion.div>
      </div>
    </section>
  );
}
