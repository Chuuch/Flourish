import { create } from 'zustand';
import { applyTheme, readStoredTheme, THEME_STORAGE_KEY } from '../lib/theme';
import type { Theme } from '../schemas/theme.schema';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: readStoredTheme(),
  setTheme: (theme) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    applyTheme(theme);
    set({ theme });
  },
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },
}));

applyTheme(useThemeStore.getState().theme);
