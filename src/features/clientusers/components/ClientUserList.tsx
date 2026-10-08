import { Alert, Button } from '@/components/ui';
import { useClientUsers } from '../hooks/useClientUsers';
import { useAuthStore } from '@/features/auth';
import { canManageClientUsers } from '../schemas/client-user.schema';
import { useDeleteClientUser } from '../hooks/useDeleteClientUser';
import { useI18n } from '@/features/i18n';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';

export function ClientUserList({ clientId, query = '' }: { clientId: string; query?: string }) {
  const role = useAuthStore((state) => state.role);
  const canManage = canManageClientUsers(role);
  const { data, isPending, isError, error, refetch, isFetching } = useClientUsers(clientId, query);
  const deleteClientUser = useDeleteClientUser(clientId);
  const { t } = useI18n();

  if (isPending) {
    return <ListSkeleton label={t('clientUsers.loading')} />;
  }

  if (isError) {
    return (
      <Alert>
        <p>{t('clientUsers.loadError', { message: error.message })}</p>
        <Button type="button" variant="ghost" size="sm" onClick={() => void refetch()}>
          {t('common.retry')}
        </Button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return (
      <p className="text-muted m-0 text-sm">
        {query ? t('clientUsers.noMatches') : t('clientUsers.empty')}
      </p>
    );
  }

  return (
    <>
      {deleteClientUser.isError ? <Alert>{deleteClientUser.error.message}</Alert> : null}
      <ul className={isFetching ? 'stack-list opacity-70' : 'stack-list'}>
        {data.map((clientUser) => (
          <li key={clientUser.user_id}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="m-0 min-w-0 truncate text-sm font-semibold">{clientUser.email}</p>
              {canManage ? (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  disabled={deleteClientUser.isPending}
                  aria-label={t('clientUsers.remove', { email: clientUser.email })}
                  onClick={() => {
                    deleteClientUser.mutate(clientUser.user_id);
                  }}
                >
                  {t('common.delete')}
                </Button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
