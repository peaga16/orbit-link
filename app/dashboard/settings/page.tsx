'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Copy, Check } from 'lucide-react';

const THEMES = [
  { id: 'modern', name: 'Moderno', colors: ['#FF0000', '#000000'] },
  { id: 'dark', name: 'Escuro', colors: ['#1F2937', '#111827'] },
  { id: 'minimal', name: 'Minimalista', colors: ['#FFFFFF', '#E5E7EB'] },
  { id: 'vibrant', name: 'Vibrante', colors: ['#EC4899', '#8B5CF6'] },
];

export default function SettingsPage() {
  const [workspace, setWorkspace] = useState({
    name: 'North Studio',
    slug: 'northstudio',
    title: 'North Studio - Agência de Design',
    description: 'Agência especializada em identidade visual e branding',
    theme: 'modern',
    primaryColor: '#FF0000',
    secondaryColor: '#000000',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Inter',
    showBranding: true,
  });

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const publicUrl = `https://linkflow.com.br/${workspace.slug}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    // Aqui faria a requisição API para salvar
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleThemeSelect = (themeId: string) => {
    const theme = THEMES.find((t) => t.id === themeId);
    if (theme) {
      setWorkspace({
        ...workspace,
        theme: themeId,
        primaryColor: theme.colors[0],
        secondaryColor: theme.colors[1],
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-1">Personalize sua página LinkFlow</p>
      </motion.div>

      {/* Basic Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Informações Básicas
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Nome do Negócio
            </label>
            <input
              type="text"
              value={workspace.name}
              onChange={(e) =>
                setWorkspace({ ...workspace, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Slug (URL)
            </label>
            <div className="flex gap-2">
              <div className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
                <span className="text-gray-600 text-sm">
                  linkflow.com.br/
                </span>
                <input
                  type="text"
                  value={workspace.slug}
                  onChange={(e) =>
                    setWorkspace({ ...workspace, slug: e.target.value })
                  }
                  className="flex-1 bg-transparent border-none focus:outline-none text-gray-900 font-medium"
                />
              </div>
              <button
                onClick={handleCopyUrl}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check size={18} className="text-green-600" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copiar
                  </>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Título da Página
            </label>
            <input
              type="text"
              value={workspace.title}
              onChange={(e) =>
                setWorkspace({ ...workspace, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Descrição
            </label>
            <textarea
              value={workspace.description}
              onChange={(e) =>
                setWorkspace({ ...workspace, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
        </div>
      </motion.div>

      {/* Theme & Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Tema e Design
        </h2>

        <div className="space-y-6">
          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-4">
              Temas Pré-definidos
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    workspace.theme === theme.id
                      ? 'border-red-600 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex gap-1 mb-2">
                    {theme.colors.map((color, i) => (
                      <div
                        key={i}
                        className="flex-1 h-8 rounded"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {theme.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Cor Primária
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={workspace.primaryColor}
                  onChange={(e) =>
                    setWorkspace({
                      ...workspace,
                      primaryColor: e.target.value,
                    })
                  }
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={workspace.primaryColor}
                  onChange={(e) =>
                    setWorkspace({
                      ...workspace,
                      primaryColor: e.target.value,
                    })
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Cor Secundária
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={workspace.secondaryColor}
                  onChange={(e) =>
                    setWorkspace({
                      ...workspace,
                      secondaryColor: e.target.value,
                    })
                  }
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={workspace.secondaryColor}
                  onChange={(e) =>
                    setWorkspace({
                      ...workspace,
                      secondaryColor: e.target.value,
                    })
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Cor de Fundo
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={workspace.backgroundColor}
                  onChange={(e) =>
                    setWorkspace({
                      ...workspace,
                      backgroundColor: e.target.value,
                    })
                  }
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={workspace.backgroundColor}
                  onChange={(e) =>
                    setWorkspace({
                      ...workspace,
                      backgroundColor: e.target.value,
                    })
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Preview
            </label>
            <div
              className="p-6 rounded-lg border border-gray-200 min-h-48 flex items-center justify-center"
              style={{ backgroundColor: workspace.backgroundColor }}
            >
              <div className="text-center">
                <div
                  className="inline-block px-6 py-3 rounded-lg text-white font-semibold mb-4"
                  style={{ backgroundColor: workspace.primaryColor }}
                >
                  Link de Exemplo
                </div>
                <p
                  className="text-sm font-medium"
                  style={{ color: workspace.secondaryColor }}
                >
                  {workspace.title}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Branding */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Branding</h2>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={workspace.showBranding}
              onChange={(e) =>
                setWorkspace({
                  ...workspace,
                  showBranding: e.target.checked,
                })
              }
              className="w-4 h-4 text-red-600 rounded"
            />
            <span className="text-gray-900 font-medium">
              Mostrar "Criado com LinkFlow" no rodapé
            </span>
          </label>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-4"
      >
        <button
          onClick={handleSave}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition"
        >
          {saved ? (
            <>
              <Check size={20} />
              Salvo com Sucesso!
            </>
          ) : (
            <>
              <Save size={20} />
              Salvar Configurações
            </>
          )}
        </button>
        <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-lg font-bold transition">
          Visualizar Página
        </button>
      </motion.div>
    </div>
  );
}
