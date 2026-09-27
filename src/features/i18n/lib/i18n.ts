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

export function readStoredLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const parsed = localeSchema.safeParse(window.localStorage.getItem(LOCALE_STORAGE_KEY));

  if (parsed.success) {
    return parsed.data;
  }

  const language = window.navigator.language.toLowerCase();
  return language === 'bg' || language.startsWith('bg-') ? 'bg' : 'en';
}

export function applyLocale(locale: Locale): void {
  document.documentElement.lang = locale;
}
