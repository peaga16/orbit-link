'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Eye, Link2 } from 'lucide-react';
import Link from 'next/link';

interface LinkItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  clicks: number;
  isActive: boolean;
}

export default function LinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([
    {
      id: '1',
      title: 'Instagram',
      url: 'https://instagram.com',
      description: 'Siga no Instagram',
      clicks: 1240,
      isActive: true,
    },
    {
      id: '2',
      title: 'WhatsApp',
      url: 'https://wa.me/5511999999999',
      description: 'Chat direto no WhatsApp',
      clicks: 3420,
      isActive: true,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
  });

  const handleAddLink = () => {
    if (!formData.title || !formData.url) {
      alert('Preencha título e URL');
      return;
    }

    if (editingId) {
      setLinks(
        links.map((link) =>
          link.id === editingId
            ? { ...link, ...formData }
            : link
        )
      );
      setEditingId(null);
    } else {
      setLinks([
        ...links,
        {
          id: Date.now().toString(),
          ...formData,
          clicks: 0,
          isActive: true,
        },
      ]);
    }

    setFormData({ title: '', url: '', description: '' });
    setShowModal(false);
  };

  const handleEdit = (link: LinkItem) => {
    setFormData({
      title: link.title,
      url: link.url,
      description: link.description || '',
    });
    setEditingId(link.id);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar este link?')) {
      setLinks(links.filter((link) => link.id !== id));
    }
  };

  const handleToggle = (id: string) => {
    setLinks(
      links.map((link) =>
        link.id === id ? { ...link, isActive: !link.isActive } : link
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Links</h1>
          <p className="text-gray-600 mt-1">Gerencie seus links personalizados</p>
        </div>
        <button
          onClick={() => {
            setFormData({ title: '', url: '', description: '' });
            setEditingId(null);
            setShowModal(true);
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
        >
          <Plus size={20} />
          Novo Link
        </button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg border border-gray-200 p-4"
        >
          <div className="text-sm text-gray-600">Total de Links</div>
          <div className="text-2xl font-bold text-gray-900">{links.length}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg border border-gray-200 p-4"
        >
          <div className="text-sm text-gray-600">Total de Cliques</div>
          <div className="text-2xl font-bold text-gray-900">
            {links.reduce((acc, link) => acc + link.clicks, 0).toLocaleString()}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg border border-gray-200 p-4"
        >
          <div className="text-sm text-gray-600">Links Ativos</div>
          <div className="text-2xl font-bold text-gray-900">
            {links.filter((l) => l.isActive).length}
          </div>
        </motion.div>
      </div>

      {/* Links List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden"
      >
        {links.length === 0 ? (
          <div className="p-12 text-center">
            <Link2 size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum link ainda
            </h3>
            <p className="text-gray-600">Comece adicionando seu primeiro link</p>
          </div>
        ) : (
          <div className="divide-y">
            {links.map((link) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-600">{link.url}</p>
                  {link.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {link.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 mr-4">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                      <Eye size={16} />
                      {link.clicks}
                    </div>
                    <div className="text-xs text-gray-500">Cliques</div>
                  </div>

                  <button
                    onClick={() => handleToggle(link.id)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                      link.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {link.isActive ? 'Ativo' : 'Inativo'}
                  </button>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(link)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl max-w-md w-full"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Editar Link' : 'Novo Link'}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Ex: Instagram"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  URL
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Descrição (opcional)
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descrição"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddLink}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
              >
                {editingId ? 'Atualizar' : 'Adicionar'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
