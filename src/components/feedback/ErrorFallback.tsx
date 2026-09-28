import { useI18n } from '@/features/i18n';
import { Button } from '@/components/ui';
import { CircleAlert } from 'lucide-react';

interface ErrorFallbackProps {
  onRetry: () => void;
}

export function ErrorFallback({ onRetry }: ErrorFallbackProps) {
  const { t } = useI18n();
  return (
    <main role="alert">
      <CircleAlert className="text-danger size-10" aria-hidden="true" />
      <h1>{t('error.title')}</h1>
      <p className="text-muted">{t('error.body')}</p>
      <Button type="button" onClick={onRetry}>
        {t('error.tryAgain')}
      </Button>
    </main>
  );
}
