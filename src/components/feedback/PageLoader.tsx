import { useI18n } from '@/features/i18n';
import { Spinner } from './Spinner';

export function PageLoader() {
  const { t } = useI18n();
  return (
    <div role="status" className="flex min-h-40 items-center justify-center gap-2 py-12">
      <Spinner />
      <span className="sr-only">{t('loader.loading')}</span>
    </div>
  );
}
