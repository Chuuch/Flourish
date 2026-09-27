import { translate, type TranslateVars } from '../lib/i18n';
import type { MessageKey } from '../locales/en';
import { useI18nStore } from '../store/i18n.store';

export function useI18n() {
  const locale = useI18nStore((state) => state.locale);
  const setLocale = useI18nStore((state) => state.setLocale);

  return {
    locale,
    setLocale,
    t: (key: MessageKey, vars?: TranslateVars) => translate(locale, key, vars),
  };
}
