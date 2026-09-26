import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './server';
import { useAuthStore } from '@/features/auth';
import { applyTheme, THEME_STORAGE_KEY, useThemeStore } from '@/features/theme';

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

afterAll(() => {
  server.close();
});
