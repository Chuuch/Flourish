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
    <p className={cn('flex items-center gap-2', large && 'gap-2.5')}>
      <Leaf
        className={cn('text-accent shrink-0', large ? 'size-5' : 'size-4')}
        aria-hidden="true"
      />
      <span className={cn('font-semibold tracking-tight', large ? 'text-xl' : 'text-base')}>
        {t('home.brand')}
      </span>
    </p>
  );
}
