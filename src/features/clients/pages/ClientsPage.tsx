import { PageHeader, SearchField } from '@/components/ui';
import { useAuthStore } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { useModal } from '@/features/modal';
import { useListSearch } from '@/hooks/useListSearch';
import { ClientList } from '../components/ClientList';
import { CreateClientForm } from '../components/CreateClientForm';
import { canManageClients } from '../schemas/client.schema';

export function ClientsPage() {
  const { t } = useI18n();
  const { openModal, closeModal } = useModal();
  const role = useAuthStore((state) => state.role);
  const canCreate = canManageClients(role);
  const { value, setValue, query } = useListSearch();

  return (
    <main>
      <PageHeader
        title={t('clients.title')}
        {...(canCreate
          ? {
              createLabel: t('clients.add'),
              onCreate: () => {
                openModal({
                  title: t('clients.add'),
                  content: (
                    <CreateClientForm
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
          placeholder={t('clients.searchPlaceholder')}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
        />
      </div>
      <ClientList query={query} />
    </main>
  );
}
