import { useI18n } from '@/features/i18n';

interface ErrorFallbackProps {
  onRetry: () => void;
}

export function ErrorFallback({ onRetry }: ErrorFallbackProps) {
  const { t } = useI18n();
  return (
    <main role="alert">
      <h1>{t('error.title')}</h1>

      <p>{t('error.body')}</p>
      <button type="button" onClick={onRetry}>
        {t('error.tryAgain')}
      </button>
    </main>
  );
}
