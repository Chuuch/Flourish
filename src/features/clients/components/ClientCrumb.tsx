import { clientPath } from '@/app/router/paths';
import { useI18n } from '@/features/i18n';
import { Link } from 'react-router';
import { useClient } from '../hooks/useClient';

export function ClientCrumb({ clientId }: { clientId: string }) {
  const { client } = useClient(clientId);
  const { t } = useI18n();

  return <Link to={clientPath(clientId)}>{client?.name ?? t('clients.hubCrumb')}</Link>;
}
