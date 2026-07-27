const CLOUDINARY_HOST = 'res.cloudinary.com';
const UNSPLASH_HOST = 'images.unsplash.com';

export function isNextImageHost(value?: string | null) {
  if (!value) return false;
  try {
    const hostname = new URL(value).hostname;
    return hostname === CLOUDINARY_HOST || hostname === UNSPLASH_HOST;
  } catch {
    return false;
  }
}

export function optimizeImageUrl(
  value: string,
  options: { width?: number; height?: number; quality?: number; crop?: 'fill' | 'limit' } = {},
) {
  try {
    const url = new URL(value);
    const width = Math.max(64, Math.min(options.width || 1200, 2400));
    const height = options.height ? Math.max(64, Math.min(options.height, 2400)) : undefined;
    const quality = Math.max(45, Math.min(options.quality || 72, 90));

    if (url.hostname === CLOUDINARY_HOST && url.pathname.includes('/image/upload/')) {
      const crop = options.crop === 'fill' ? 'c_fill,g_auto' : 'c_limit';
      const transformation = [
        'f_auto',
        `q_auto:${quality >= 80 ? 'good' : 'eco'}`,
        crop,
        `w_${width}`,
        height ? `h_${height}` : '',
        'dpr_auto',
      ].filter(Boolean).join(',');

      url.pathname = url.pathname.replace('/image/upload/', `/image/upload/${transformation}/`);
      return url.toString();
    }

    if (url.hostname === UNSPLASH_HOST) {
      url.searchParams.set('auto', 'format');
      url.searchParams.set('fit', options.crop === 'fill' ? 'crop' : 'max');
      url.searchParams.set('w', String(width));
      if (height) url.searchParams.set('h', String(height));
      url.searchParams.set('q', String(quality));
      return url.toString();
    }

    return value;
  } catch {
    return value;
  }
}
