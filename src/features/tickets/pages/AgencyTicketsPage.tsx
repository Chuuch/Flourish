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
        <h1>{t('tickets.title')}</h1>
        <p>{t('clients.notFoundPeriod')}</p>
      </main>
    );
  }

  return (
    <main>
      <p>
        <Link to={paths.clients}>{t('common.clients')}</Link>
        {' / '}
        <Link to={clientPath(clientId)}>{t('clients.hubCrumb')}</Link>
      </p>
      <h1>{t('tickets.title')}</h1>
      <AgencyTicketList clientId={clientId} />
    </main>
  );
}
