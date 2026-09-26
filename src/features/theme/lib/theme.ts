import { themeSchema, type Theme } from '../schemas/theme.schema';

export const THEME_STORAGE_KEY = 'flourish-theme';

export function prefersDark(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function readStoredTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const parsed = themeSchema.safeParse(window.localStorage.getItem(THEME_STORAGE_KEY));

  if (parsed.success) {
    return parsed.data;
  }

  return prefersDark() ? 'dark' : 'light';
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset['theme'] = theme;
  document.documentElement.style.colorScheme = theme;
}
