import { catalogs } from '../locales/catalogs';
import { type MessageKey } from '../locales/en';
import { localeSchema, type Locale } from '../schemas/locale.schema';

export const LOCALE_STORAGE_KEY = 'flourish-locale';

export type TranslateVars = Record<string, string | number>;

export function interpolate(template: string, vars?: TranslateVars): string {
  if (!vars) {
    return template;
  }

  return template.replace(/\{\{(\w+)\}\}/g, (_match, name: string) => {
    const value = vars[name];
    return value === undefined ? `{{${name}}}` : String(value);
  });
}

export function translate(locale: Locale, key: MessageKey, vars?: TranslateVars): string {
  const catalog = catalogs[locale];
  return interpolate(catalog[key], vars);
}

export function localeFromLanguage(language: string): Locale {
  const base = language.toLowerCase().split('-')[0];
  const parsed = localeSchema.safeParse(base);

  if (parsed.success) {
    return parsed.data;
  }

  return 'en';
}

export function readStoredLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const parsed = localeSchema.safeParse(window.localStorage.getItem(LOCALE_STORAGE_KEY));

  if (parsed.success) {
    return parsed.data;
  }
  return localeFromLanguage(window.navigator.language);
}

export function applyLocale(locale: Locale): void {
  document.documentElement.lang = locale;
}
