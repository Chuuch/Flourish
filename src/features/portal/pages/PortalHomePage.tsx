import { useAuthStore } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { CreateTicketForm, TicketList } from '@/features/tickets';

export function PortalHomePage() {
  const user = useAuthStore((state) => state.user);
  const client = useAuthStore((state) => state.client);
  const { t } = useI18n();

  return (
    <main>
      <h1>{t('portal.title')}</h1>
      {user ? <p>{user.email}</p> : null}
      {client ? <p>{client.name}</p> : null}
      <h2>{t('common.tickets')}</h2>
      <CreateTicketForm />
      <TicketList />
    </main>
  );
}
