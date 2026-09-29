import { Alert } from '@/components/ui';
import { useClients } from '../hooks/useClients';
import { Link } from 'react-router';
import { clientPath, clientTicketsPath, clientUsersPath } from '@/app/router/paths';
import { useI18n } from '@/features/i18n';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';

export function ClientList() {
  const { data, isPending, isError, error, refetch } = useClients();
  const { t } = useI18n();

  if (isPending) {
    return <ListSkeleton label={t('clients.loading')} />;
  }

  if (isError) {
    return (
      <Alert>
        <p>{t('clients.loadError', { message: error.message })}</p>
        <button type="button" onClick={() => void refetch()}>
          {t('common.retry')}
        </button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p>{t('clients.empty')}</p>;
  }

  return (
    <ul>
      {data.map((client) => (
        <li key={client.id}>
          <Link to={clientPath(client.id)}>
            {client.notes ? `${client.name} - ${client.notes}` : client.name}
          </Link>
          <Link to={clientUsersPath(client.id)}>{t('common.users')}</Link>
          <Link to={clientTicketsPath(client.id)}>{t('common.tickets')}</Link>
        </li>
      ))}
    </ul>
  );
}
