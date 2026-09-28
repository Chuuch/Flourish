import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { server } from './server';
import { useAuthStore } from '@/features/auth';
import { applyTheme, THEME_STORAGE_KEY, useThemeStore } from '@/features/theme';
import { applyLocale, LOCALE_STORAGE_KEY, useI18nStore } from '@/features/i18n';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  Toaster: () => null,
}));

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
});

afterEach(() => {
  useAuthStore.getState().clearSession();
});

afterEach(() => {
  window.localStorage.removeItem(THEME_STORAGE_KEY);
  useThemeStore.setState({ theme: 'light' });
  applyTheme('light');
});

afterEach(() => {
  window.localStorage.removeItem(LOCALE_STORAGE_KEY);
  useI18nStore.setState({ locale: 'en' });
  applyLocale('en');
});

afterAll(() => {
  server.close();
});
