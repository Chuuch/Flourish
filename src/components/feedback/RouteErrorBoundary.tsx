import { isRouteErrorResponse, useRouteError } from 'react-router';

import { logger } from '@/lib/logger/logger';
import { useI18n } from '@/features/i18n';
import { Button } from '@/components/ui';

export function RouteErrorBoundary() {
  const error = useRouteError();
  const { t } = useI18n();

  if (error instanceof Error) {
    logger.error('Unhandled route error', error);

    return (
      <main role="alert">
        <h1>{t('error.title')}</h1>
        <p>{t('error.body')}</p>
        <Button
          type="button"
          onClick={() => {
            window.location.reload();
          }}
        >
          {t('error.reload')}
        </Button>
      </main>
    );
  }

  if (isRouteErrorResponse(error)) {
    return (
      <main role="alert">
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{t('error.pageLoad')}</p>
        <Button
          type="button"
          onClick={() => {
            window.location.reload();
          }}
        >
          {t('error.reload')}
        </Button>
      </main>
    );
  }

  return (
    <main role="alert">
      <h1>{t('error.title')}</h1>
      <p>{t('error.body')}</p>
      <Button
        type="button"
        onClick={() => {
          window.location.reload();
        }}
      >
        {t('error.reload')}
      </Button>
    </main>
  );
}
