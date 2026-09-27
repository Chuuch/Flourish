import { useI18n } from '@/features/i18n';

export function PageLoader() {
  const { t } = useI18n();
  return <p role="status">{t('loader.loading')}</p>;
}
