import { afterEach, describe, expect, it, vi } from 'vitest';

describe('env', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('prefers runtime config when present', async () => {
    vi.stubGlobal('__APP_CONFIG__', { API_URL: 'https://api.example.com', APP_ENV: 'staging' });

    const { env } = await import('./env');

    expect(env).toEqual({ API_URL: 'https://api.example.com', APP_ENV: 'staging' });
  });

  it('falls back to Vite env in development and test', async () => {
    const { env } = await import('./env');

    expect(env.API_URL).toBe(import.meta.env['VITE_API_URL']);
  });

  it('fails fast on invalid config', async () => {
    vi.stubGlobal('__APP_CONFIG__', { API_URL: 'not-a-url', APP_ENV: 'production' });
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(import('./env')).rejects.toThrow('Invalid environment configuration');
  });
});
