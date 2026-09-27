import { useI18n } from '../hooks/useI18n';
import { locales, localeSchema } from '../schemas/locale.schema';

export function LocaleSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <label>
      {t('locale.label')}
      <select
        aria-label={t('locale.label')}
        className="block rounded border border-line bg-surface text-ink px-2 py-1"
        value={locale}
        onChange={(event) => {
          const parsed = localeSchema.safeParse(event.currentTarget.value);

          if (!parsed.success) {
            return;
          }

          setLocale(parsed.data);
        }}
      >
        {locales.map((code) => (
          <option key={code} value={code}>
            {t(`locale.name.${code}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
