'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, Click, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useUser();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard/stats');
        const data = await res.json();
        setStats(data);

        // Simulate chart data
        setChartData([
          { name: 'Seg', views: 120, clicks: 40 },
          { name: 'Ter', views: 221, clicks: 95 },
          { name: 'Qua', views: 229, clicks: 130 },
          { name: 'Qui', views: 200, clicks: 98 },
          { name: 'Sex', views: 300, clicks: 201 },
          { name: 'Sab', views: 250, clicks: 120 },
          { name: 'Dom', views: 200, clicks: 80 },
        ]);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      icon: Eye,
      label: 'Visualizações',
      value: '12,450',
      change: '+12.5%',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Click,
      label: 'Cliques',
      value: '2,840',
      change: '+8.2%',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: TrendingUp,
      label: 'Taxa de Conversão',
      value: '22.8%',
      change: '+4.3%',
      color: 'bg-red-100 text-red-600',
    },
    {
      icon: Users,
      label: 'Visitantes Únicos',
      value: '1,284',
      change: '+15.7%',
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">
          Bem-vindo, {user?.firstName}! 👋
        </h1>
        <p className="text-red-100">
          Acompanhe sua performance e gerencie seus links em tempo real
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              {stat.label}
            </h3>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <span className="text-green-600 text-xs font-medium">
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Visualizações Últimos 7 Dias
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#dc2626"
                dot={{ fill: '#dc2626' }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Clicks Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Cliques Últimos 7 Dias
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="clicks" fill="#16a34a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/dashboard/links"
            className="p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors group cursor-pointer"
          >
            <div className="font-semibold text-red-600 group-hover:text-red-700">
              ➕ Adicionar Link
            </div>
            <p className="text-sm text-gray-600 mt-1">Crie um novo link personalizado</p>
          </Link>

          <Link
            href="/dashboard/settings"
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group cursor-pointer"
          >
            <div className="font-semibold text-blue-600 group-hover:text-blue-700">
              🎨 Personalizar
            </div>
            <p className="text-sm text-gray-600 mt-1">Customize seu tema e cores</p>
          </Link>

          <Link
            href="/dashboard/analytics"
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group cursor-pointer"
          >
            <div className="font-semibold text-green-600 group-hover:text-green-700">
              📊 Analytics
            </div>
            <p className="text-sm text-gray-600 mt-1">Veja análises detalhadas</p>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
