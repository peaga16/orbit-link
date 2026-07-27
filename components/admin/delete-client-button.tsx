'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';

export function DeleteClientButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function removeClient() {
    if (!window.confirm(`Excluir o cliente “${name}”? Essa ação não pode ser desfeita.`)) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/clients/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error();
      router.refresh();
    } catch {
      window.alert('Não foi possível excluir o cliente.');
      setLoading(false);
    }
  }

  return (
    <button onClick={removeClient} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60">
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Excluir
    </button>
  );
}
