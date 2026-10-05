import { useI18n } from '@/features/i18n';
import { ClientList } from '../components/ClientList';
import { CreateClientForm } from '../components/CreateClientForm';

export function ClientsPage() {
  const { t } = useI18n();

  return (
    <main>
      <div className="page-header">
        <h1>{t('clients.title')}</h1>
      </div>
      <CreateClientForm />
      <ClientList />
    </main>
  );
}
