import { paths } from '@/app/router/paths';
import { useAuthStore } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { PortalInvoiceList } from '@/features/invoices/components/PortalInvoiceList';
import { CreateTicketForm, TicketList } from '@/features/tickets';
import { Link } from 'react-router';

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
      <h2>
        <Link to={paths.portalInvoices}>{t('common.invoices')}</Link>
      </h2>
      <PortalInvoiceList />
    </main>
  );
}
