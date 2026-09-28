import { Alert, Button } from '@/components/ui';
import { useClientUsers } from '../hooks/useClientUsers';
import { useAuthStore } from '@/features/auth';
import { canManageClientUsers } from '../schemas/client-user.schema';
import { useDeleteClientUser } from '../hooks/useDeleteClientUser';
import { useI18n } from '@/features/i18n';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';

export function ClientUserList({ clientId }: { clientId: string }) {
  const role = useAuthStore((state) => state.role);
  const canManage = canManageClientUsers(role);
  const { data, isPending, isError, error, refetch } = useClientUsers(clientId);
  const deleteClientUser = useDeleteClientUser(clientId);
  const { t } = useI18n();

  if (isPending) {
    return <ListSkeleton label={t('clientUsers.loading')} />;
  }

  if (isError) {
    return (
      <Alert>
        <p>{t('clientUsers.loadError', { message: error.message })}</p>
        <button type="button" onClick={() => void refetch()}>
          {t('common.retry')}
        </button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p>{t('clientUsers.empty')}</p>;
  }

  return (
    <>
      {deleteClientUser.isError ? <Alert>{deleteClientUser.error.message}</Alert> : null}
      <ul>
        {data.map((clientUser) => (
          <li key={clientUser.user_id}>
            {clientUser.email}
            {canManage ? (
              <Button
                type="button"
                disabled={deleteClientUser.isPending}
                onClick={() => {
                  deleteClientUser.mutate(clientUser.user_id);
                }}
              >
                {t('clientUsers.remove', { email: clientUser.email })}
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </>
  );
}
