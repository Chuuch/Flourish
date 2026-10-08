import { clientPath, paths } from '@/app/router/paths';
import { PageHeader, SearchField } from '@/components/ui';
import { useAuthStore } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { useModal } from '@/features/modal';
import { useListSearch } from '@/hooks/useListSearch';
import { Link, useParams } from 'react-router';
import { CreateClientUserForm } from '../components/CreateClientUserForm';
import { ClientUserList } from '../components/ClientUserList';
import { canManageClientUsers } from '../schemas/client-user.schema';

export function ClientUsersPage() {
  const { clientId } = useParams();
  const { t } = useI18n();
  const { openModal, closeModal } = useModal();
  const role = useAuthStore((state) => state.role);
  const canCreate = canManageClientUsers(role);
  const { value, setValue, query } = useListSearch();

  if (!clientId) {
    return (
      <main>
        <PageHeader title={t('clientUsers.title')} description={t('clients.notFound')} />
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
      <PageHeader
        title={t('clientUsers.title')}
        {...(canCreate
          ? {
              createLabel: t('clientUsers.invite'),
              onCreate: () => {
                openModal({
                  title: t('clientUsers.invite'),
                  content: (
                    <CreateClientUserForm
                      clientId={clientId}
                      onSuccess={() => {
                        closeModal();
                      }}
                      onCancel={() => {
                        closeModal();
                      }}
                    />
                  ),
                });
              },
            }
          : {})}
      />
      <div className="mb-4">
        <SearchField
          label={t('common.search')}
          placeholder={t('clientUsers.searchPlaceholder')}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
        />
      </div>
      <ClientUserList clientId={clientId} query={query} />
    </main>
  );
}
