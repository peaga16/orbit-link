'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { QRCode } from '@/components/ui/qrcode';
import { ExternalLink, ArrowUpRight } from 'lucide-react';

interface WorkspacePageProps {
  params: {
    slug: string;
  };
}

export default function PublicWorkspacePage({ params }: WorkspacePageProps) {
  const [workspace, setWorkspace] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const res = await fetch(`/api/public/workspace/${params.slug}`);
        const data = await res.json();
        setWorkspace(data.workspace);
        setLinks(data.links);
      } catch (error) {
        console.error('Error fetching workspace:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspace();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Página não encontrada
          </h1>
          <p className="text-gray-600">
            A página que você procura não existe.
          </p>
        </div>
      </div>
    );
  }

  const bgColor = workspace.backgroundColor || '#ffffff';
  const primaryColor = workspace.primaryColor || '#FF0000';

  return (
    <div
      className="min-h-screen py-12 px-4 transition-colors duration-300"
      style={{ backgroundColor: bgColor }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          {workspace.logo && (
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              src={workspace.logo}
              alt={workspace.name}
              className="w-24 h-24 mx-auto mb-4 rounded-full object-cover shadow-lg"
            />
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900">
              {workspace.title || workspace.name}
            </h1>
            {workspace.description && (
              <p className="text-lg text-gray-600 max-w-lg mx-auto">
                {workspace.description}
              </p>
            )}
          </motion.div>
        </div>

        {/* Links Grid */}
        <div className="grid gap-4 mb-12">
          {links.map((link, index) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg cursor-pointer"
                style={{
                  borderColor: primaryColor,
                  backgroundColor: `${primaryColor}08`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${primaryColor}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${primaryColor}08`;
                }}
              >
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-red-600 transition-colors">
                    {link.title}
                  </h3>
                  {link.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {link.description}
                    </p>
                  )}
                </div>
                <ArrowUpRight
                  size={20}
                  className="text-gray-400 group-hover:text-red-600 transition-colors ml-4 flex-shrink-0"
                  style={{ color: primaryColor }}
                />
              </a>
            </motion.div>
          ))}
        </div>

        {/* Pix QR Codes Section */}
        {workspace.pixQRCodes?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-8 border border-gray-200 mb-12"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Formas de Pagamento
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {workspace.pixQRCodes.map((pix) => (
                <div key={pix.id} className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {pix.title}
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg inline-block">
                    <QRCode value={pix.pixKey} size={150} />
                  </div>
                  {pix.description && (
                    <p className="text-sm text-gray-600 mt-2">
                      {pix.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        {workspace.showBranding !== false && (
          <div className="text-center text-sm text-gray-500">
            <p>Criado com LinkFlow - Sua plataforma de presença digital</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
