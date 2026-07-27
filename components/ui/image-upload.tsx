'use client';

import { ChangeEvent, useRef, useState } from 'react';
import { Image as ImageIcon, Loader2, Trash2, UploadCloud } from 'lucide-react';

type ImageUploadProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  folder: string;
  help?: string;
  previewClassName?: string;
};

export function ImageUpload({
  label,
  value,
  onChange,
  folder,
  help,
  previewClassName = 'h-40',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function upload(file?: File) {
    if (!file) return;
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Não foi possível enviar a imagem.');
      onChange(data.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Não foi possível enviar a imagem.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    void upload(event.target.files?.[0]);
  }

  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        {value ? (
          <div className={`relative w-full overflow-hidden bg-slate-100 ${previewClassName}`}>
            <img src={value} alt={label} className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-2 bg-gradient-to-t from-black/70 to-transparent p-3 pt-10">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-lg bg-white/95 px-3 py-2 text-xs font-bold text-slate-800"
              >
                <UploadCloud size={14} /> Trocar
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white"
              >
                <Trash2 size={14} /> Remover
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex min-h-32 w-full flex-col items-center justify-center gap-3 p-5 text-center transition hover:bg-white disabled:opacity-60"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              {uploading ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">{uploading ? 'Enviando imagem...' : 'Selecionar imagem'}</div>
              <div className="mt-1 text-xs text-slate-500">JPG, PNG, WEBP ou GIF, até 8 MB</div>
            </div>
          </button>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFile} className="hidden" />

      <div className="mt-2 flex items-center gap-2">
        <UploadCloud size={14} className="shrink-0 text-slate-400" />
        <input
          className="min-w-0 flex-1 border-0 bg-transparent p-0 text-xs text-slate-500 outline-none placeholder:text-slate-400"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="ou cole uma URL pública"
        />
      </div>
      {help && <p className="field-help">{help}</p>}
      {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}
