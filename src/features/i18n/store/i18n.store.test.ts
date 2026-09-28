import { describe, expect, it, vi } from 'vitest';
import { applyLocale, LOCALE_STORAGE_KEY, readStoredLocale, translate } from '../lib/i18n';
import { useI18nStore } from './i18n.store';

describe('readStoredLocale', () => {
  it('reads a stored locale', () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, 'bg');

    expect(readStoredLocale()).toBe('bg');
  });

  it('falls back to English when nothing is stored', () => {
    expect(readStoredLocale()).toBe('en');
  });

  it('detects a supported browser language', () => {
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('de-AT');

    expect(readStoredLocale()).toBe('de');
  });
});

describe('translate', () => {
  it('interpolates values', () => {
    expect(translate('en', 'tasks.save', { title: 'Fix login' })).toBe('Save Fix login');
    expect(translate('bg', 'tasks.save', { title: 'Fix login' })).toBe('Запази Fix login');
  });
});

describe('useI18nStore', () => {
  it('persists a locale', () => {
    useI18nStore.getState().setLocale('bg');

    expect(useI18nStore.getState().locale).toBe('bg');
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('bg');
    expect(document.documentElement.lang).toBe('bg');
  });
});

describe('applyLocale', () => {
  it('sets the document language', () => {
    applyLocale('bg');

    expect(document.documentElement.lang).toBe('bg');
  });
});
