import { env } from '@/config/env';
import { captureException } from '../observability/sentry';

type LogContext = Readonly<Record<string, unknown>>;

interface Logger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, error?: unknown, context?: LogContext): void;
}

const isProduction = env.APP_ENV === 'production';

function normalizeError(error: unknown): unknown {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return error;
}

export const logger: Logger = {
  debug(message, context) {
    if (!isProduction) {
      console.debug(message, context);
    }
  },

  info(message, context) {
    if (!isProduction) {
      console.info(message, context);
    }
  },

  warn(message, context) {
    console.warn(message, context);
  },

  error(message, error, context) {
    console.error(message, {
      error: normalizeError(error),
      ...context,
    });

    if (error !== undefined) {
      captureException(error, { message, ...context });
    }
  },
};
