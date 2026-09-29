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
    <p className={cn('flex items-center justify-center gap-2', large && 'gap-3')}>
      <Leaf className={cn('text-accent', large ? 'size-10' : 'size-5')} aria-hidden="true" />
      <span className={cn('font-semibold tracking-tight', large ? 'text-3xl' : 'text-base')}>
        {t('home.brand')}
      </span>
    </p>
  );
}
