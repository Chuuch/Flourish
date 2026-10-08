import { clientPath, paths } from '@/app/router/paths';
import { SearchField } from '@/components/ui';
import { useI18n } from '@/features/i18n';
import { useListSearch } from '@/hooks/useListSearch';
import { Link, useParams } from 'react-router';
import { AgencyTicketList } from '../components/AgencyTicketList';

export function AgencyTicketsPage() {
  const { clientId } = useParams();
  const { t } = useI18n();
  const { value, setValue, query } = useListSearch();

  if (!clientId) {
    return (
      <main>
        <div className="page-header">
          <h1>{t('tickets.title')}</h1>
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
        <Link to={clientPath(clientId)}>{t('clients.hubCrumb')}</Link>
      </p>
      <div className="page-header">
        <h1>{t('tickets.title')}</h1>
      </div>
      <div className="mb-4">
        <SearchField
          label={t('common.search')}
          placeholder={t('tickets.searchPlaceholder')}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
        />
      </div>
      <AgencyTicketList clientId={clientId} query={query} />
    </main>
  );
}
