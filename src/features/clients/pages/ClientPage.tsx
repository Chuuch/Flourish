import { Link, useParams } from 'react-router';
import {
  clientInvoicesPath,
  clientProjectsPath,
  clientTicketsPath,
  clientUsersPath,
  paths,
} from '@/app/router/paths';
import { Alert, Button } from '@/components/ui';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { useAuthStore } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { useClientUsers } from '@/features/clientusers/hooks/useClientUsers';
import { useInvoices } from '@/features/invoices/hooks/useInvoices';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { useStaffTickets } from '@/features/tickets/hooks/useStaffTickets';
import { ClientManageForm } from '../components/ClientManageForm';
import { useClient } from '../hooks/useClient';
import { canManageClients } from '../schemas/client.schema';

export function ClientPage() {
  const { clientId } = useParams();
  const role = useAuthStore((state) => state.role);
  const { t } = useI18n();

  if (!clientId) {
    return (
      <main>
        <div className="page-header">
          <h1>{t('clients.title')}</h1>
          <p>{t('clients.notFoundPeriod')}</p>
        </div>
      </main>
    );
  }

  return <ClientHub clientId={clientId} canManage={canManageClients(role)} />;
}

function ClientHub({ clientId, canManage }: { clientId: string; canManage: boolean }) {
  const { client, isPending, isError, error, refetch } = useClient(clientId);
  const projects = useProjects(clientId);
  const tickets = useStaffTickets(clientId);
  const invoices = useInvoices(clientId);
  const users = useClientUsers(clientId);
  const { t } = useI18n();

  if (isPending) {
    return (
      <main>
        <ListSkeleton label={t('clients.loading')} />
      </main>
    );
  }

  if (isError) {
    const message = error instanceof Error ? error.message : '';
    return (
      <main>
        <Alert>
          <p>{t('clients.loadError', { message })}</p>
          <Button type="button" variant="ghost" size="sm" onClick={() => void refetch()}>
            {t('common.retry')}
          </Button>
        </Alert>
      </main>
    );
  }

  if (!client) {
    return (
      <main>
        <p className="breadcrumb">
          <Link to={paths.clients}>{t('common.clients')}</Link>
        </p>
        <div className="page-header">
          <h1>{t('clients.notFound')}</h1>
          <p>{t('clients.notFoundPeriod')}</p>
        </div>
      </main>
    );
  }

  const nav = [
    {
      to: clientProjectsPath(clientId),
      label: t('common.projects'),
      count: projects.data?.pages.flatMap((page) => page.items).length,
    },
    {
      to: clientTicketsPath(clientId),
      label: t('common.tickets'),
      count: tickets.data?.pages.flatMap((page) => page.items).length,
    },
    {
      to: clientInvoicesPath(clientId),
      label: t('common.invoices'),
      count: invoices.data?.pages.flatMap((page) => page.items).length,
    },
    {
      to: clientUsersPath(clientId),
      label: t('clientUsers.title'),
      count: users.data?.length,
    },
  ] as const;

  return (
    <main className="client-hub">
      <p className="breadcrumb">
        <Link to={paths.clients}>{t('common.clients')}</Link>
      </p>

      <div className="page-header">
        <h1>{client.name}</h1>
        <p>{client.notes ? client.notes : t('clients.notesEmpty')}</p>
      </div>

      <nav className="hub-nav" aria-label={client.name}>
        {nav.map((item) => (
          <Link key={item.to} to={item.to} className="hub-nav-link">
            <span>{item.label}</span>
            {typeof item.count === 'number' ? (
              <span className="hub-nav-count">{item.count}</span>
            ) : null}
          </Link>
        ))}
      </nav>

      {canManage ? (
        <details className="settings-disclosure">
          <summary>{t('clients.billingHeading')}</summary>
          <ClientManageForm client={client} />
        </details>
      ) : null}
    </main>
  );
}
