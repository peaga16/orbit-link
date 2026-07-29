'use client';

import { ChangeEvent, useRef, useState } from 'react';
import { Image as ImageIcon, Loader2, Trash2, UploadCloud } from 'lucide-react';
import { RemoteImage } from '@/components/ui/remote-image';

const MAX_SOURCE_SIZE = 12 * 1024 * 1024;
const MAX_FINAL_SIZE = 3.8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

type ImageUploadProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  folder: string;
  help?: string;
  previewClassName?: string;
};

function sanitizeFolder(value: string) {
  return (
    value
      .toLowerCase()
      .split('/')
      .map((part) => part.replace(/[^a-z0-9_-]/g, '').slice(0, 50))
      .filter(Boolean)
      .join('/')
      .slice(0, 120) || 'geral'
  );
}

function sanitizeFileName(value: string) {
  const extension = value
    .split('.')
    .pop()
    ?.toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  const baseName = value
    .replace(/\.[^/.]+$/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70) || 'imagem';

  return extension ? `${baseName}.${extension}` : baseName;
}

function getTargetDimension(folder: string) {
  if (/logo|avatar|perfil/i.test(folder)) return 1600;
  return 2560;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/webp', quality);
  });
}

async function optimizeImage(file: File, folder: string) {
  if (file.type === 'image/gif') {
    if (file.size > MAX_FINAL_SIZE) {
      throw new Error('GIFs devem ter no máximo 3,8 MB.');
    }
    return file;
  }

  const bitmap = await createImageBitmap(file);

  try {
    const maxDimension = getTargetDimension(folder);
    let scale = Math.min(
      1,
      maxDimension / Math.max(bitmap.width, bitmap.height),
    );
    let quality = 0.86;

    for (let attempt = 0; attempt < 10; attempt += 1) {
      const width = Math.max(1, Math.round(bitmap.width * scale));
      const height = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext('2d', { alpha: true });
      if (!context) {
        throw new Error('Seu navegador não conseguiu preparar esta imagem.');
      }

      context.drawImage(bitmap, 0, 0, width, height);
      const optimizedBlob = await canvasToBlob(canvas, quality);

      if (optimizedBlob && optimizedBlob.size <= MAX_FINAL_SIZE) {
        const baseName = sanitizeFileName(file.name).replace(/\.[^/.]+$/, '');
        return new File([optimizedBlob], `${baseName}.webp`, {
          type: 'image/webp',
          lastModified: Date.now(),
        });
      }

      if (quality > 0.62) {
        quality -= 0.08;
      } else {
        scale *= 0.82;
      }
    }

    throw new Error(
      'Não foi possível reduzir esta imagem para o limite de envio. Escolha outra imagem.',
    );
  } finally {
    bitmap.close();
  }
}

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
      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        throw new Error('Envie uma imagem JPG, PNG, WEBP ou GIF.');
      }

      if (file.size > MAX_SOURCE_SIZE) {
        throw new Error('A imagem original deve ter no máximo 12 MB.');
      }

      const safeFolder = sanitizeFolder(folder);
      const optimizedFile = await optimizeImage(file, safeFolder);
      const formData = new FormData();
      formData.append('file', optimizedFile);
      formData.append('folder', safeFolder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
        cache: 'no-store',
      });

      const data = (await response.json().catch(() => null)) as
        | { url?: string; error?: string }
        | null;

      if (!response.ok || !data?.url) {
        throw new Error(data?.error || 'Não foi possível enviar a imagem.');
      }

      onChange(data.url);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : 'Não foi possível enviar a imagem.',
      );
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
            <RemoteImage
              src={value}
              alt={label}
              fill
              width={900}
              height={500}
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={72}
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-2 bg-gradient-to-t from-black/70 to-transparent p-3 pt-10">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-lg bg-white/95 px-3 py-2 text-xs font-bold text-slate-800 disabled:opacity-60"
              >
                {uploading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <UploadCloud size={14} />
                )}
                {uploading ? 'Enviando...' : 'Trocar'}
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-60"
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
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              {uploading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <ImageIcon size={20} />
              )}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">
                {uploading ? 'Otimizando e enviando...' : 'Selecionar imagem'}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                JPG, PNG, WEBP ou GIF, até 12 MB
              </div>
            </div>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFile}
        className="hidden"
      />

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
