import Link from 'next/link';
import { Edit3, ExternalLink, Link2, Plus, Search, Users } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { DeleteClientButton } from '@/components/admin/delete-client-button';

export const dynamic = 'force-dynamic';

export default async function ClientsPage({ searchParams }: { searchParams?: { q?: string } }) {
  const query = searchParams?.q?.trim() || '';
  let clients: Array<any> = [];
  let databaseError = false;

  try {
    clients = await prisma.workspace.findMany({
      where: query
        ? { OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { slug: { contains: query, mode: 'insensitive' } },
            { title: { contains: query, mode: 'insensitive' } },
          ] }
        : undefined,
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { links: true, pixQRCodes: true } } },
    });
  } catch {
    databaseError = true;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">Clientes cadastrados</h2>
          <p className="mt-1 text-sm text-slate-500">Edite páginas, links, aparência e status de publicação.</p>
        </div>
        <Link href="/admin/clientes/novo" className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500"><Plus size={17} /> Novo cliente</Link>
      </div>

      {databaseError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">Execute <code className="rounded bg-amber-100 px-1.5 py-1">npm run setup</code> para preparar o banco e inserir os dois clientes.</div>
      )}

      <form className="admin-card flex flex-col gap-3 p-4 sm:flex-row" action="/admin/clientes">
        <div className="relative max-w-md flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input name="q" defaultValue={query} className="field-input pl-11" placeholder="Pesquisar por nome ou endereço..." /></div>
        <button className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600">Pesquisar</button>
        {query && <Link href="/admin/clientes" className="rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Limpar</Link>}
      </form>

      <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {clients.map((client) => (
          <article key={client.id} className="admin-card overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="relative h-32 overflow-hidden bg-slate-900">
              <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: client.headerImage ? `url(${client.headerImage})` : `linear-gradient(135deg, ${client.primaryColor}, ${client.secondaryColor})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute left-5 top-5 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border-2 border-white/30 text-xl font-bold text-white shadow-lg" style={{ backgroundColor: client.primaryColor }}>
                {client.logo ? <img src={client.logo} alt="" className="h-full w-full object-cover" /> : client.name.charAt(0)}
              </div>
              <span className="absolute right-4 top-4 rounded-full bg-emerald-400/90 px-2.5 py-1 text-[10px] font-bold text-emerald-950 backdrop-blur">PUBLICADO</span>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0"><h3 className="truncate text-lg font-bold text-slate-950">{client.name}</h3><p className="mt-1 truncate text-xs text-slate-400">/{client.slug}</p></div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400"><Users size={17} /></div>
              </div>
              <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">{client.description || 'Cliente sem descrição cadastrada.'}</p>
              <div className="mt-5 grid grid-cols-3 divide-x divide-slate-100 rounded-xl bg-slate-50 py-3 text-center">
                <div><div className="text-sm font-bold text-slate-900">{client._count.links}</div><div className="text-[10px] text-slate-400">Links</div></div>
                <div><div className="text-sm font-bold text-slate-900">{client.views}</div><div className="text-[10px] text-slate-400">Views</div></div>
                <div><div className="text-sm font-bold text-slate-900">{client.clicks}</div><div className="text-[10px] text-slate-400">Cliques</div></div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href={`/admin/clientes/${client.id}`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-600"><Edit3 size={14} /> Editar</Link>
                <Link href={`/${client.slug}`} target="_blank" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"><ExternalLink size={14} /> Abrir</Link>
                <DeleteClientButton id={client.id} name={client.name} />
              </div>
            </div>
          </article>
        ))}
      </div>

      {!clients.length && !databaseError && (
        <div className="admin-card flex flex-col items-center justify-center p-14 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600"><Link2 size={27} /></div>
          <h3 className="mt-5 text-lg font-bold text-slate-900">{query ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500">{query ? 'Tente pesquisar usando outro nome ou endereço.' : 'Cadastre a primeira página ou execute o seed para incluir os exemplos.'}</p>
          <Link href="/admin/clientes/novo" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white"><Plus size={17} /> Cadastrar cliente</Link>
        </div>
      )}
    </div>
  );
}
