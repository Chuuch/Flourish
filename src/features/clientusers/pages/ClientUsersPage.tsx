import { clientProjectsPath, paths } from '@/app/router/paths';
import { Link, useParams } from 'react-router';
import { CreateClientUserForm } from '../components/CreateClientUserForm';
import { ClientUserList } from '../components/ClientUserList';
import { useI18n } from '@/features/i18n';

export function ClientUsersPage() {
  const { clientId } = useParams();
  const { t } = useI18n();

  if (!clientId) {
    return (
      <main>
        <h1>{t('clientUsers.title')}</h1>
        <p>{t('clients.notFound')}</p>
      </main>
    );
  }

  return (
    <main>
      <p>
        <Link to={paths.clients}>{t('common.clients')}</Link>
        {' / '}
        <Link to={clientProjectsPath(clientId)}>{t('common.projects')}</Link>
      </p>
      <h1>{t('clientUsers.title')}</h1>
      <CreateClientUserForm clientId={clientId} />
      <ClientUserList clientId={clientId} />
    </main>
  );
}
