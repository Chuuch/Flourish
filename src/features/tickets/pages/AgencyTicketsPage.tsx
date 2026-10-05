import { clientPath, paths } from '@/app/router/paths';
import { Link, useParams } from 'react-router';
import { AgencyTicketList } from '../components/AgencyTicketList';
import { useI18n } from '@/features/i18n';

export function AgencyTicketsPage() {
  const { clientId } = useParams();
  const { t } = useI18n();

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
      <AgencyTicketList clientId={clientId} />
    </main>
  );
}
