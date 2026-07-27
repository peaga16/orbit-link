'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { SignUpButton } from '@clerk/nextjs';

const plans = [
  {
    name: 'Iniciante',
    price: 29.90,
    description: 'Perfeito para começar',
    popular: false,
    features: [
      'Links ilimitados',
      'QR Code Pix',
      'Analytics básico',
      '1 formulário',
      'Tema personalizado',
      'Suporte por email',
      'Até 10 mil visualizações/mês',
    ],
  },
  {
    name: 'Profissional',
    price: 49.90,
    description: 'Para pequenos negócios',
    popular: true,
    features: [
      'Tudo do plano Iniciante',
      'NFC Tags (5)',
      '5 formulários',
      'Analytics avançado',
      'Integrações (WhatsApp, Instagram)',
      'Suporte prioritário',
      'Até 100 mil visualizações/mês',
      'Catálogo de produtos',
    ],
  },
  {
    name: 'Premium',
    price: 89.90,
    description: 'Para empresas',
    popular: false,
    features: [
      'Tudo do plano Profissional',
      'NFC Tags (25)',
      'Formulários ilimitados',
      'Agenda/Agendamentos',
      'Integrações ilimitadas',
      'Domínio customizado',
      'Visualizações ilimitadas',
      'Suporte 24/7',
      'API access',
    ],
  },
];

export function PricingPlans() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Planos e Preços
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Escolha o plano perfeito para suas necessidades
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                plan.popular
                  ? 'ring-2 ring-red-600 bg-red-50 transform scale-105'
                  : 'border border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    Mais Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">
                    R$ {plan.price.toFixed(2)}
                  </span>
                  <span className="text-gray-600 ml-2">/mês</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <Check
                        size={20}
                        className={
                          plan.popular
                            ? 'text-red-600'
                            : 'text-gray-400'
                        }
                      />
                    </div>
                    <span className="text-gray-700 text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <SignUpButton mode="modal">
                <button
                  className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'border border-gray-300 text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Começar Agora
                </button>
              </SignUpButton>

              {/* Billing Note */}
              <p className="text-center text-xs text-gray-500 mt-4">
                Desconto de 2 meses no plano anual
              </p>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-4">
            Precisa de uma solução customizada?{' '}
            <a href="#" className="text-red-600 hover:text-red-700 font-semibold">
              Entre em contato conosco
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
