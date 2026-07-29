import Image from 'next/image';

type OrbitLogoVariant = 'light' | 'dark' | 'adaptive';
type OrbitLogoSize = 'compact' | 'small' | 'medium' | 'large';

const sizes: Record<OrbitLogoSize, { width: number; height: number; className: string; wrapperClassName: string; sizes: string }> = {
  compact: { width: 108, height: 36, className: 'h-7 w-auto max-w-[108px]', wrapperClassName: 'h-7 w-[108px]', sizes: '108px' },
  small: { width: 132, height: 44, className: 'h-8 w-auto max-w-[132px]', wrapperClassName: 'h-8 w-[132px]', sizes: '132px' },
  medium: { width: 164, height: 52, className: 'h-10 w-auto max-w-[164px]', wrapperClassName: 'h-10 w-[164px]', sizes: '164px' },
  large: { width: 210, height: 68, className: 'h-12 w-auto max-w-[210px]', wrapperClassName: 'h-12 w-[210px]', sizes: '210px' },
};

export function OrbitLogo({
  variant = 'dark',
  size = 'medium',
  priority = false,
  className = '',
}: {
  variant?: OrbitLogoVariant;
  size?: OrbitLogoSize;
  priority?: boolean;
  className?: string;
}) {
  const config = sizes[size];

  if (variant === 'adaptive') {
    return (
      <span className={`orbit-logo-adaptive relative inline-flex shrink-0 ${config.wrapperClassName} ${className}`}>
        <Image
          src="/images/logos/logo-orbit.png"
          alt="Orbit"
          fill
          sizes={config.sizes}
          priority={priority}
          className="orbit-logo-on-light object-contain object-left"
        />
        <Image
          src="/images/logos/logobrancavermelha1.png"
          alt=""
          fill
          sizes={config.sizes}
          priority={priority}
          aria-hidden="true"
          className="orbit-logo-on-dark object-contain object-left"
        />
      </span>
    );
  }

  const src = variant === 'light'
    ? '/images/logos/logo-orbit.png'
    : '/images/logos/logobrancavermelha1.png';

  return (
    <Image
      src={src}
      alt="Orbit"
      width={config.width}
      height={config.height}
      sizes={config.sizes}
      priority={priority}
      className={`shrink-0 object-contain object-left ${config.className} ${className}`}
    />
  );
}
