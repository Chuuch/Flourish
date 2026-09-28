import { Alert } from '@/components/ui';
import { useUsers } from '../hooks/useUsers';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { useI18n } from '@/features/i18n';

export function UserList() {
  const { data, isPending, isError, error, refetch } = useUsers();
  const { t } = useI18n();

  if (isPending) {
    return <ListSkeleton label={t('users.loading')} />;
  }

  if (isError) {
    return (
      <Alert>
        <p>{t('users.loadError', { message: error.message })}</p>
        <button type="button" onClick={() => void refetch()}>
          {t('common.retry')}
        </button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p>{t('users.empty')}</p>;
  }

  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.email}</li>
      ))}
    </ul>
  );
}
