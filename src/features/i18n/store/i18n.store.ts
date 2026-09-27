import { create } from 'zustand';
import {
  applyLocale,
  LOCALE_STORAGE_KEY,
  readStoredLocale,
  translate,
  type TranslateVars,
} from '../lib/i18n';
import type { MessageKey } from '../locales/en';
import type { Locale } from '../schemas/locale.schema';

interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useI18nStore = create<I18nState>((set) => ({
  locale: readStoredLocale(),
  setLocale: (locale) => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    applyLocale(locale);
    set({ locale });
  },
}));

applyLocale(useI18nStore.getState().locale);

export function t(key: MessageKey, vars?: TranslateVars): string {
  return translate(useI18nStore.getState().locale, key, vars);
}
