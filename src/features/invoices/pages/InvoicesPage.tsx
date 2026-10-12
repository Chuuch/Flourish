import { paths } from '@/app/router/paths';
import { SearchField } from '@/components/ui';
import { ClientCrumb } from '@/features/clients/components/ClientCrumb';
import { useI18n } from '@/features/i18n';
import { useListSearch } from '@/hooks/useListSearch';
import { Link, useParams } from 'react-router';
import { InvoiceList } from '../components/InvoiceList';

export function InvoicesPage() {
  const { clientId } = useParams();
  const { t } = useI18n();
  const { value, setValue, query } = useListSearch();

  if (!clientId) {
    return (
      <main>
        <div className="page-header">
          <h1>{t('invoices.title')}</h1>
          <p>{t('clients.notFoundPeriod')}</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <p className="breadcrumb">
        <Link to={paths.clients}>{t('common.clients')}</Link>
        <span aria-hidden="true">/</span>
        <ClientCrumb clientId={clientId} />
      </p>
      <div className="page-header">
        <h1>{t('invoices.title')}</h1>
      </div>
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
      <InvoiceList clientId={clientId} query={query} />
    </main>
  );
}
