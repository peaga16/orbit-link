import Image from 'next/image';
import { isNextImageHost, optimizeImageUrl } from '@/lib/image';

type RemoteImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  quality?: number;
  crop?: 'fill' | 'limit';
};

export function RemoteImage({
  src,
  alt,
  className,
  sizes,
  priority = false,
  fill = false,
  width = 800,
  height = 800,
  quality = 72,
  crop = 'fill',
}: RemoteImageProps) {
  const optimizedSrc = optimizeImageUrl(src, { width, height: fill ? height : undefined, quality, crop });

  if (!isNextImageHost(src)) {
    return (
      <img
        src={optimizedSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        className={fill ? `absolute inset-0 h-full w-full ${className || ''}` : className}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={optimizedSrc}
        alt={alt}
        fill
        sizes={sizes || '100vw'}
        priority={priority}
        quality={quality}
        className={className}
      />
    );
  }

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      quality={quality}
      className={className}
    />
  );
}
