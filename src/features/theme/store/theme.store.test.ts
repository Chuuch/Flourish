import { describe, expect, it } from 'vitest';
import { applyTheme, readStoredTheme, THEME_STORAGE_KEY } from '../lib/theme';
import { useThemeStore } from './theme.store';

describe('readStoredTheme', () => {
  it('reads a stored theme', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');

    expect(readStoredTheme()).toBe('dark');
  });

  it('falls back to light when nothing is stored', () => {
    expect(readStoredTheme()).toBe('light');
  });
});

describe('applyTheme', () => {
  it('sets the document theme', () => {
    applyTheme('dark');

    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });
});

describe('useThemeStore', () => {
  it('persists a theme', () => {
    useThemeStore.getState().setTheme('dark');

    expect(useThemeStore.getState().theme).toBe('dark');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('toggles the theme', () => {
    useThemeStore.getState().setTheme('light');
    useThemeStore.getState().toggleTheme();

    expect(useThemeStore.getState().theme).toBe('dark');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });
});
