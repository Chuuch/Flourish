import { useI18n } from '../hooks/useI18n';
import { locales, localeSchema } from '../schemas/locale.schema';

export function LocaleSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <label className="text-muted px-3 text-[0.65rem] font-bold tracking-[0.08em] uppercase">
      {t('locale.label')}
      <select
        aria-label={t('locale.label')}
        className="border-line bg-control text-ink mt-1.5 block w-full rounded-lg border px-2.5 py-2 text-sm font-medium tracking-normal normal-case"
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
