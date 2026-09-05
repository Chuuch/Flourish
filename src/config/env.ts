import { z } from 'zod';

declare global {
  interface Window {
    readonly __APP_CONFIG__?: Readonly<Record<string, unknown>>;
  }
}

const envSchema = z.object({
  API_URL: z.url('API_URL must be a valid URL'),
  APP_ENV: z.enum(['development', 'test', 'staging', 'production']),
  SENTRY_DSN: z.url().optional(),
});

export type Env = z.infer<typeof envSchema>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readRawEnv(): Record<string, unknown> {
  const runtime: unknown = window.__APP_CONFIG__;
  if (isRecord(runtime)) {
    return runtime;
  }

  return {
    API_URL: import.meta.env['VITE_API_URL'],
    APP_ENV: import.meta.env['VITE_APP_ENV'],
    SENTRY_DSN: import.meta.env['VITE_SENTRY_DSN'] || undefined,
  };
}

const parsed = envSchema.safeParse(readRawEnv());

if (!parsed.success) {
  console.error('❌ Invalid environment configuration:', z.flattenError(parsed.error).fieldErrors);
  throw new Error('Invalid environment configuration');
}

export const env: Env = parsed.data;
