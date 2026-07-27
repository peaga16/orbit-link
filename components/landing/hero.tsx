'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SignUpButton } from '@clerk/nextjs';

export function Hero() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black pt-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-20">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 mb-4 w-fit bg-red-600/10 border border-red-600/30 rounded-full px-4 py-2"
            >
              <Sparkles size={16} className="text-red-500" />
              <span className="text-sm font-medium text-red-400">Central de Presença Digital</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Sua presença digital em{' '}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                um único lugar
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-400 mb-8 max-w-xl"
            >
              Crie uma página personalizada com links, QR Code Pix, NFC, formulários e muito mais. 
              Tudo em um só lugar, com design profissional e analytics em tempo real.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <SignUpButton mode="modal">
                <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold flex items-center gap-2 transition transform hover:scale-105 duration-300">
                  Começar Agora
                  <ArrowRight size={20} />
                </button>
              </SignUpButton>
              <button className="border border-gray-600 hover:border-gray-400 text-white px-8 py-4 rounded-lg font-bold transition">
                Ver Demo
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-8 mt-8 pt-8 border-t border-gray-800"
            >
              <div>
                <div className="text-2xl font-bold text-white">+5k</div>
                <div className="text-sm text-gray-400">Usuários Ativos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">1M+</div>
                <div className="text-sm text-gray-400">Links Criados</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">50M+</div>
                <div className="text-sm text-gray-400">Cliques/Mês</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Phone Mock */}
              <div className="relative w-72 h-96 bg-gradient-to-br from-red-900 to-black rounded-3xl border-8 border-gray-800 shadow-2xl overflow-hidden">
                {/* Screen */}
                <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black p-4 flex flex-col overflow-hidden">
                  {/* Notch */}
                  <div className="h-6 bg-black rounded-b-2xl mb-2 flex items-center justify-center">
                    <div className="w-32 h-3 bg-black rounded-full"></div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    {/* Avatar */}
                    <div className="flex justify-center pt-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🎯</span>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="space-y-2 px-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-8 bg-gradient-to-r from-red-500/50 to-red-600/50 rounded-lg animate-pulse"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -left-20 top-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 w-48 shadow-xl"
              >
                <div className="text-sm font-semibold text-white mb-2">Analytics</div>
                <div className="text-2xl font-bold text-red-400">1,234</div>
                <div className="text-xs text-gray-400">Visualizações hoje</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                className="absolute -right-20 bottom-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 w-48 shadow-xl"
              >
                <div className="text-sm font-semibold text-white mb-2">Receita Pix</div>
                <div className="text-2xl font-bold text-green-400">R$ 1.240</div>
                <div className="text-xs text-gray-400">Esta semana</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
