import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.url('VITE_API_URL must be a valid URL'),
  VITE_APP_ENV: z.enum(['development', 'test', 'staging', 'production']),
});

// Explicitly pick environment variables to validate against the schema
const rawEnv: Record<string, unknown> = {
  VITE_API_URL: import.meta.env['VITE_API_URL'],
  VITE_APP_ENV: import.meta.env['VITE_APP_ENV'],
};

const parsed = envSchema.safeParse(rawEnv);

if (!parsed.success) {
  console.error(
    '❌ Invalid environment configuration:',
    z.flattenError(parsed.error).fieldErrors
  );
  throw new Error('Invalid environment configuration');
}

export const env = parsed.data;
