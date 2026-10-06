import { SelectField } from '@/components/ui';
import { useI18n } from '../hooks/useI18n';
import { locales, localeSchema } from '../schemas/locale.schema';

export function LocaleSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="px-2.5">
      <SelectField
        label={t('locale.label')}
        hideLabel
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
      </SelectField>
    </div>
  );
}
