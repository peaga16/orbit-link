'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  GripVertical,
  KeyRound,
  Link2,
  Loader2,
  Palette,
  Plus,
  QrCode,
  Save,
  Settings2,
  Trash2,
} from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import { RemoteImage } from '@/components/ui/remote-image';

type LinkItem = {
  id?: string;
  title: string;
  url: string;
  description: string;
  icon: string;
  style: 'compact' | 'artwork';
  isActive: boolean;
};

type PixItem = {
  id?: string;
  title: string;
  pixKey: string;
  amount: number | null;
  description: string;
  isActive: boolean;
};

export type ClientFormData = {
  id?: string;
  name: string;
  slug: string;
  title: string;
  description: string;
  theme: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  backgroundImage: string;
  fontFamily: string;
  logo: string;
  headerImage: string;
  showBranding: boolean;
  clientEmail: string;
  clientPassword: string;
  links: LinkItem[];
  pixQRCodes: PixItem[];
};

function createBlankData(): ClientFormData {
  return {
    name: '',
    slug: '',
    title: '',
    description: '',
    theme: 'modern',
    primaryColor: '#EF232A',
    secondaryColor: '#111111',
    backgroundColor: '#FFFFFF',
    backgroundImage: '',
    fontFamily: 'Tecna',
    logo: '',
    headerImage: '',
    showBranding: true,
    clientEmail: '',
    clientPassword: '',
    links: [
      { title: 'Instagram', url: 'https://instagram.com/', description: 'Acompanhe nosso trabalho', icon: '', style: 'compact', isActive: true },
      { title: 'WhatsApp', url: 'https://wa.me/55', description: 'Fale diretamente conosco', icon: '', style: 'compact', isActive: true },
    ],
    pixQRCodes: [],
  };
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

function SectionTitle({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600"><Icon size={19} /></div>
      <div>
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}

export function ClientForm({
  mode,
  initialData,
  access = 'admin',
}: {
  mode: 'create' | 'edit';
  initialData?: ClientFormData;
  access?: 'admin' | 'client';
}) {
  const router = useRouter();
  const [form, setForm] = useState<ClientFormData>(initialData || createBlankData());
  const [slugEdited, setSlugEdited] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const isClient = access === 'client';

  const previewTextColor = useMemo(() => {
    const hex = form.backgroundColor.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16) || 255;
    const g = parseInt(hex.slice(2, 4), 16) || 255;
    const b = parseInt(hex.slice(4, 6), 16) || 255;
    return (r * 299 + g * 587 + b * 114) / 1000 > 155 ? '#111111' : '#FFFFFF';
  }, [form.backgroundColor]);

  function update<K extends keyof ClientFormData>(key: K, value: ClientFormData[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateName(value: string) {
    setForm((current) => ({ ...current, name: value, slug: slugEdited ? current.slug : slugify(value) }));
  }

  function updateLink(index: number, key: keyof LinkItem, value: string | boolean) {
    setForm((current) => ({
      ...current,
      links: current.links.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
    }));
  }

  function addLink() {
    setForm((current) => ({
      ...current,
      links: [...current.links, { title: '', url: '', description: '', icon: '', style: 'compact', isActive: true }],
    }));
  }

  function removeLink(index: number) {
    setForm((current) => ({ ...current, links: current.links.filter((_, itemIndex) => itemIndex !== index) }));
  }

  function updatePix(index: number, key: keyof PixItem, value: string | boolean | number | null) {
    setForm((current) => ({
      ...current,
      pixQRCodes: current.pixQRCodes.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
    }));
  }

  function addPix() {
    setForm((current) => ({
      ...current,
      pixQRCodes: [...current.pixQRCodes, { title: 'Pagar com Pix', pixKey: '', amount: null, description: '', isActive: true }],
    }));
  }

  function removePix(index: number) {
    setForm((current) => ({ ...current, pixQRCodes: current.pixQRCodes.filter((_, itemIndex) => itemIndex !== index) }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = isClient
        ? '/api/client/workspace'
        : mode === 'create'
          ? '/api/admin/clients'
          : `/api/admin/clients/${form.id}`;
      const response = await fetch(endpoint, {
        method: isClient || mode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Não foi possível salvar.');

      if (!isClient && mode === 'create') {
        router.replace(`/admin/clientes/${data.client.id}`);
      } else {
        setSuccess('Alterações salvas com sucesso.');
        setForm((current) => ({ ...current, clientPassword: '' }));
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-[1500px]">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href={isClient ? '/dashboard' : '/admin/clientes'} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"><ArrowLeft size={16} /> {isClient ? 'Voltar ao painel' : 'Voltar aos clientes'}</Link>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
            {isClient ? 'Editar minha página' : mode === 'create' ? 'Cadastrar novo cliente' : `Editar ${form.name}`}
          </h2>
          <p className="mt-1 text-sm text-slate-500">Altere conteúdo, imagens, links e aparência com prévia em tempo real.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {form.slug && (
            <Link href={`/${form.slug}`} target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"><ExternalLink size={16} /> Abrir página</Link>
          )}
          <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500 disabled:opacity-60">
            {saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />} {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </div>

      {(error || success) && (
        <div className={`mb-6 rounded-xl border px-4 py-3 text-sm ${error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
          {error || success}
        </div>
      )}

      <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          {!isClient && (
            <section className="admin-card p-5 sm:p-7">
              <SectionTitle icon={KeyRound} title="Acesso do cliente" description="Credenciais usadas pelo cliente para entrar e editar a própria página." />
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="field-label">E-mail de acesso *</label>
                  <input type="email" className="field-input" value={form.clientEmail} onChange={(e) => update('clientEmail', e.target.value)} placeholder="cliente@empresa.com" required />
                </div>
                <div>
                  <label className="field-label">{mode === 'create' ? 'Senha inicial *' : 'Nova senha'}</label>
                  <input type="password" minLength={8} className="field-input" value={form.clientPassword} onChange={(e) => update('clientPassword', e.target.value)} placeholder={mode === 'create' ? 'Mínimo de 8 caracteres' : 'Deixe vazio para manter a atual'} required={mode === 'create'} />
                </div>
              </div>
              <p className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-700">O cliente acessará <strong>/cliente/login</strong> e verá apenas os dados e métricas da própria página.</p>
            </section>
          )}

          <section className="admin-card p-5 sm:p-7">
            <SectionTitle icon={Settings2} title="Informações principais" description="Dados que identificam a marca na página pública." />
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="field-label">Nome *</label>
                <input className="field-input" value={form.name} onChange={(e) => updateName(e.target.value)} placeholder="Ex.: North Studio" required />
              </div>
              <div>
                <label className="field-label">Endereço da página *</label>
                <div className="flex rounded-xl border border-slate-200 bg-white focus-within:border-red-400 focus-within:ring-4 focus-within:ring-red-100">
                  <span className="flex items-center border-r border-slate-200 px-3 text-xs text-slate-400">/</span>
                  <input className="min-w-0 flex-1 rounded-r-xl px-3 py-3 text-sm text-slate-900 outline-none" value={form.slug} onChange={(e) => { setSlugEdited(true); update('slug', slugify(e.target.value)); }} placeholder="northstudio" required />
                </div>
                <p className="field-help">URL pública: /{form.slug || 'cliente'}</p>
              </div>
              <div className="sm:col-span-2">
                <label className="field-label">Título principal</label>
                <input className="field-input" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Design que transforma marcas" />
              </div>
              <div className="sm:col-span-2">
                <label className="field-label">Descrição</label>
                <textarea className="field-input min-h-28 resize-y" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Apresente a marca em poucas linhas..." />
              </div>
              <div className="sm:col-span-2">
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 p-4">
                  <span><span className="block text-sm font-semibold text-slate-800">Exibir assinatura Orbit</span><span className="mt-1 block text-xs text-slate-500">Mostra a assinatura no rodapé da página.</span></span>
                  <input type="checkbox" checked={form.showBranding} onChange={(e) => update('showBranding', e.target.checked)} className="h-5 w-5 accent-red-600" />
                </label>
              </div>
            </div>
          </section>

          <section className="admin-card p-5 sm:p-7">
            <SectionTitle icon={Palette} title="Identidade visual" description="Envie imagens pelo computador e personalize cores e estilo." />
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="field-label">Tema</label>
                <select className="field-input" value={form.theme} onChange={(e) => update('theme', e.target.value)}>
                  <option value="modern">Moderno</option>
                  <option value="dark">Escuro</option>
                  <option value="minimal">Minimalista</option>
                  <option value="vibrant">Vibrante</option>
                </select>
              </div>
              <div>
                <label className="field-label">Fonte</label>
                <select className="field-input" value={form.fontFamily} onChange={(e) => update('fontFamily', e.target.value)}>
                  <option value="Tecna">Tecna</option>
                  <option value="Inter">Inter</option>
                  <option value="Arial">Arial</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                </select>
              </div>
              {[
                ['Cor principal', 'primaryColor'],
                ['Cor secundária', 'secondaryColor'],
                ['Cor de fundo', 'backgroundColor'],
              ].map(([label, key]) => (
                <div key={key}>
                  <label className="field-label">{label}</label>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2">
                    <input type="color" value={form[key as 'primaryColor']} onChange={(e) => update(key as 'primaryColor', e.target.value)} className="h-10 w-12 cursor-pointer rounded-lg border-0 bg-transparent" />
                    <input value={form[key as 'primaryColor']} onChange={(e) => update(key as 'primaryColor', e.target.value)} className="min-w-0 flex-1 text-sm font-semibold uppercase text-slate-600 outline-none" />
                  </div>
                </div>
              ))}
              <div className="sm:col-span-2 grid gap-5 sm:grid-cols-2">
                <ImageUpload label="Logo ou foto de perfil" value={form.logo} onChange={(value) => update('logo', value)} folder={`${form.slug || 'cliente'}/logo`} previewClassName="h-48" />
                <ImageUpload label="Imagem de capa" value={form.headerImage} onChange={(value) => update('headerImage', value)} folder={`${form.slug || 'cliente'}/capa`} previewClassName="h-48" />
              </div>
              <div className="sm:col-span-2">
                <ImageUpload
                  label="Imagem de fundo da página inteira"
                  value={form.backgroundImage}
                  onChange={(value) => update('backgroundImage', value)}
                  folder={`${form.slug || 'cliente'}/fundo`}
                  help="A imagem cobre toda a página pública. A cor de fundo continua sendo usada como fallback e sobreposição para manter a leitura."
                  previewClassName="h-64"
                />
              </div>
            </div>
          </section>

          <section id="links" className="admin-card p-5 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <SectionTitle icon={Link2} title="Links da página" description="Cada link pode ter título, descrição e uma imagem própria enviada como anexo." />
              <button type="button" onClick={addLink} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"><Plus size={16} /> Adicionar link</button>
            </div>
            <div className="space-y-4">
              {form.links.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">Nenhum link adicionado.</div>}
              {form.links.map((link, index) => (
                <div key={link.id || index} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-400"><GripVertical size={16} /> Link {index + 1}</div>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-500"><input type="checkbox" checked={link.isActive} onChange={(e) => updateLink(index, 'isActive', e.target.checked)} className="accent-red-600" /> Ativo</label>
                      <button type="button" onClick={() => removeLink(index)} className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600" aria-label="Remover link"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="field-label">Formato do link</label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => updateLink(index, 'style', 'compact')}
                          className={`rounded-xl border p-4 text-left transition ${link.style !== 'artwork' ? 'border-red-300 bg-red-50 ring-2 ring-red-100' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                        >
                          <div className="text-sm font-bold text-slate-900">Foto pequena + texto</div>
                          <div className="mt-1 text-xs leading-5 text-slate-500">Exibe uma miniatura ao lado do título e da descrição.</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => updateLink(index, 'style', 'artwork')}
                          className={`rounded-xl border p-4 text-left transition ${link.style === 'artwork' ? 'border-red-300 bg-red-50 ring-2 ring-red-100' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                        >
                          <div className="text-sm font-bold text-slate-900">Arte completa</div>
                          <div className="mt-1 text-xs leading-5 text-slate-500">A imagem ocupa todo o botão e nenhum texto aparece sobre ela.</div>
                        </button>
                      </div>
                    </div>
                    <input className="field-input" value={link.title} onChange={(e) => updateLink(index, 'title', e.target.value)} placeholder={link.style === 'artwork' ? 'Nome interno do link' : 'Título do link'} />
                    <input className="field-input" value={link.url} onChange={(e) => updateLink(index, 'url', e.target.value)} placeholder="https://..." />
                    <input className="field-input sm:col-span-2" value={link.description} onChange={(e) => updateLink(index, 'description', e.target.value)} placeholder={link.style === 'artwork' ? 'Descrição interna opcional' : 'Descrição opcional'} />
                    <div className="sm:col-span-2">
                      <ImageUpload
                        label={link.style === 'artwork' ? 'Arte completa do botão' : 'Imagem pequena do link'}
                        value={link.icon}
                        onChange={(value) => updateLink(index, 'icon', value)}
                        folder={`${form.slug || 'cliente'}/links`}
                        help={link.style === 'artwork' ? 'Use uma arte horizontal pronta, de preferência na proporção 16:7. O título e a descrição não serão exibidos.' : 'Essa imagem aparece em miniatura ao lado do texto.'}
                        previewClassName={link.style === 'artwork' ? 'aspect-[16/7]' : 'h-44'}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-card p-5 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <SectionTitle icon={QrCode} title="Pix" description="Adicione uma chave Pix e gere o QR Code automaticamente." />
              <button type="button" onClick={addPix} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"><Plus size={16} /> Adicionar Pix</button>
            </div>
            <div className="space-y-4">
              {form.pixQRCodes.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">O Pix é opcional.</div>}
              {form.pixQRCodes.map((pix, index) => (
                <div key={pix.id || index} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">Pix {index + 1}</div>
                    <button type="button" onClick={() => removePix(index)} className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input className="field-input" value={pix.title} onChange={(e) => updatePix(index, 'title', e.target.value)} placeholder="Título" />
                    <input className="field-input" value={pix.pixKey} onChange={(e) => updatePix(index, 'pixKey', e.target.value)} placeholder="Chave Pix" />
                    <input type="number" min="0" step="0.01" className="field-input" value={pix.amount ?? ''} onChange={(e) => updatePix(index, 'amount', e.target.value === '' ? null : Number(e.target.value))} placeholder="Valor opcional" />
                    <input className="field-input" value={pix.description} onChange={(e) => updatePix(index, 'description', e.target.value)} placeholder="Descrição opcional" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="xl:sticky xl:top-28 xl:self-start">
          <div className="mb-3 flex items-center justify-between px-1">
            <div><div className="text-sm font-bold text-slate-900">Prévia da página</div><div className="text-xs text-slate-500">Atualização em tempo real</div></div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> LIVE</span>
          </div>
          <div className="rounded-[32px] border border-slate-200 bg-slate-950 p-3 shadow-2xl">
            <div className="relative min-h-[720px] overflow-hidden rounded-[24px]" style={{ backgroundColor: form.backgroundColor, color: form.backgroundImage ? '#FFFFFF' : previewTextColor, fontFamily: form.fontFamily === 'Tecna' ? 'var(--font-tecna)' : form.fontFamily }}>
              {form.backgroundImage && (
                <>
                  <RemoteImage src={form.backgroundImage} alt="" fill width={900} height={1440} sizes="440px" quality={60} className="object-cover" />
                  <div className="absolute inset-0 bg-black/65" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
                </>
              )}
              <div className="absolute inset-0 opacity-[0.055] fine-grid" />
              <div className="relative p-5">
                <div className="relative h-32 overflow-hidden rounded-2xl bg-slate-200" style={!form.headerImage ? { background: `linear-gradient(135deg, ${form.primaryColor}, ${form.secondaryColor})` } : undefined}>{form.headerImage && <RemoteImage src={form.headerImage} alt="" fill width={760} height={256} sizes="380px" quality={60} className="object-cover" />}{form.headerImage && <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />}</div>
                <div className="relative mx-auto -mt-10 h-20 w-20 overflow-hidden rounded-2xl border-4 shadow-xl" style={{ borderColor: form.backgroundColor, backgroundColor: form.primaryColor }}>
                  {form.logo ? <RemoteImage src={form.logo} alt="Logo" fill width={160} height={160} sizes="80px" quality={60} className="object-cover" /> : <div className="flex h-full w-full items-center justify-center text-2xl font-black text-white">{form.name.charAt(0) || 'O'}</div>}
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-2xl font-bold">{form.name || 'Nome do cliente'}</h3>
                  <p className="mt-1 text-sm opacity-60">{form.title || 'Título principal da página'}</p>
                  <p className="mx-auto mt-3 max-w-xs text-xs leading-5 opacity-50">{form.description || 'A descrição aparecerá aqui.'}</p>
                </div>
                <div className="mt-6 space-y-3">
                  {form.links.filter((link) => link.isActive && link.title).slice(0, 5).map((link, index) => link.style === 'artwork' ? (
                    <div key={link.id || index} className="relative aspect-[16/7] overflow-hidden rounded-xl border border-white/10 bg-white/10 shadow-sm">
                      {link.icon ? (
                        <RemoteImage src={link.icon} alt={link.title} fill width={760} height={332} sizes="380px" quality={60} className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center"><Link2 size={22} className="opacity-50" /></div>
                      )}
                    </div>
                  ) : (
                    <div key={link.id || index} className="flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold shadow-sm" style={{ background: `linear-gradient(135deg, ${form.primaryColor}, ${form.secondaryColor})`, color: '#FFFFFF' }}>
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white/15">
                          {link.icon ? <RemoteImage src={link.icon} alt={link.title} fill width={80} height={80} sizes="40px" quality={55} className="object-cover" /> : <div className="flex h-full w-full items-center justify-center"><Link2 size={16} /></div>}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate">{link.title}</div>
                          {link.description && <div className="truncate text-[10px] text-white/70">{link.description}</div>}
                        </div>
                      </div>
                      <ChevronRight size={16} className="shrink-0 opacity-70" />
                    </div>
                  ))}
                  {form.links.filter((link) => link.isActive && link.title).length === 0 && <div className="rounded-xl border border-dashed p-5 text-center text-xs opacity-40">Os links ativos aparecerão aqui.</div>}
                </div>
                {form.pixQRCodes.some((pix) => pix.pixKey) && (
                  <div className="mt-5 rounded-2xl border p-4 text-center" style={{ borderColor: `${form.primaryColor}55`, backgroundColor: `${form.primaryColor}12` }}>
                    <QrCode className="mx-auto" size={30} style={{ color: form.primaryColor }} />
                    <div className="mt-2 text-sm font-bold">{form.pixQRCodes[0]?.title || 'Pagar com Pix'}</div>
                    <div className="mt-1 text-[10px] opacity-50">QR Code gerado automaticamente</div>
                  </div>
                )}
                {form.showBranding && <div className="mt-8 text-center text-[10px] font-semibold uppercase tracking-[0.18em] opacity-30">Criado com Orbit</div>}
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-xs leading-5 text-emerald-700">
            As imagens enviadas ficam hospedadas no Cloudinary e são salvas automaticamente como URLs seguras.
          </div>
        </aside>
      </div>
    </form>
  );
}
