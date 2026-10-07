import { paths } from '@/app/router/paths';
import { SearchField } from '@/components/ui';
import { useI18n } from '@/features/i18n';
import { useListSearch } from '@/hooks/useListSearch';
import { Link } from 'react-router';
import { PortalInvoiceList } from '../components/PortalInvoiceList';

export function PortalInvoicesPage() {
  const { t } = useI18n();
  const { value, setValue, query } = useListSearch();

  return (
    <main>
      <p>
        <Link to={paths.portal}>{t('portal.title')}</Link>
      </p>
      <h1>{t('invoices.title')}</h1>
      <div className="mb-4">
        <SearchField
          label={t('common.search')}
          placeholder={t('invoices.searchPlaceholder')}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
        />
      </div>
      <PortalInvoiceList query={query} />
    </main>
  );
}
