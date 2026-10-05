import { useI18n } from '@/features/i18n';
import { cn } from '@/lib/cn';
import { Leaf } from 'lucide-react';

interface BrandMarkProps {
  size?: 'sm' | 'lg' | undefined;
}

export function BrandMark({ size = 'sm' }: BrandMarkProps) {
  const { t } = useI18n();
  const large = size === 'lg';

  return (
    <p className={cn('flex items-center justify-center gap-2.5', large && 'gap-3')}>
      <span
        className={cn(
          'border-line bg-accent/10 inline-grid place-items-center rounded-full border',
          large ? 'size-14' : 'size-8',
        )}
      >
        <Leaf className={cn('text-accent', large ? 'size-7' : 'size-4')} aria-hidden="true" />
      </span>
      <span className={cn('font-semibold tracking-tight', large ? 'text-3xl' : 'text-lg')}>
        {t('home.brand')}
      </span>
    </p>
  );
}
