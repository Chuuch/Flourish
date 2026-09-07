import { afterEach, describe, expect, it, vi } from 'vitest';

function setRuntimeConfig(value: Record<string, unknown> | undefined): void {
  Object.defineProperty(window, '__APP_CONFIG__', {
    value,
    writable: true,
    configurable: true,
  });
}

describe('env', () => {
  afterEach(() => {
    setRuntimeConfig(undefined);
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('prefers runtime config when present', async () => {
    setRuntimeConfig({ API_URL: 'https://api.example.com', APP_ENV: 'staging' });
    vi.resetModules();

    const { env } = await import('./env');

    expect(env).toMatchObject({ API_URL: 'https://api.example.com', APP_ENV: 'staging' });
  });

  it('falls back to Vite env in development and test', async () => {
    setRuntimeConfig(undefined);
    const { env } = await import('./env');

    expect(env.API_URL).toBe(import.meta.env['VITE_API_URL']);
  });

  it('fails fast on invalid config', async () => {
    setRuntimeConfig({ API_URL: 'not-a-url', APP_ENV: 'production' });
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.resetModules();

    await expect(import('./env')).rejects.toThrow('Invalid environment configuration');
  });
});
