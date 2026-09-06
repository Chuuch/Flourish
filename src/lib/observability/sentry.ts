import { env } from '@/config/env';
import * as Sentry from '@sentry/react';

export function initSentry(): void {
  if (!env.SENTRY_DSN) {
    return;
  }

  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.APP_ENV,
    release: env.RELEASE,
    sendDefaultPii: false,
    enabled: env.APP_ENV !== 'test',
  });
}

export function captureException(
  error: unknown,
  context?: Readonly<Record<string, unknown>>,
): void {
  if (!env.SENTRY_DSN) {
    return;
  }

  Sentry.withScope((scope) => {
    if (context) {
      scope.setExtras(context);
    }

    Sentry.captureException(error);
  });
}
