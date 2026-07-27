'use client';

import Link from 'next/link';
import { SignUpButton, SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="font-bold text-gray-900 hidden sm:inline">LinkFlow</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition">
              Recursos
            </a>
            <a href="#showcase" className="text-gray-600 hover:text-gray-900 transition">
              Exemplos
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition">
              Preços
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-gray-900 transition font-medium"
                >
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="text-gray-700 hover:text-gray-900 transition font-medium">
                    Entrar
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition">
                    Começar Grátis
                  </button>
                </SignUpButton>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-4 space-y-3"
          >
            <a href="#features" className="block text-gray-600 hover:text-gray-900 py-2">
              Recursos
            </a>
            <a href="#showcase" className="block text-gray-600 hover:text-gray-900 py-2">
              Exemplos
            </a>
            <a href="#pricing" className="block text-gray-600 hover:text-gray-900 py-2">
              Preços
            </a>
            <div className="flex gap-2 pt-2">
              <SignInButton mode="modal">
                <button className="flex-1 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
                  Entrar
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                  Começar
                </button>
              </SignUpButton>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
