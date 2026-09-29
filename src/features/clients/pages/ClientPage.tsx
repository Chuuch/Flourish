import { Link, useParams } from 'react-router';
import {
  clientProjectsPath,
  clientTicketsPath,
  clientUsersPath,
  paths,
  projectPath,
} from '@/app/router/paths';
import { Alert } from '@/components/ui';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { useAuthStore } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { useClientUsers } from '@/features/clientusers/hooks/useClientUsers';
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
        <h1>{t('clients.title')}</h1>
        <p>{t('clients.notFoundPeriod')}</p>
      </main>
    );
  }

  return <ClientHub clientId={clientId} canManage={canManageClients(role)} />;
}

function ClientHub({ clientId, canManage }: { clientId: string; canManage: boolean }) {
  const { client, isPending, isError, error, refetch } = useClient(clientId);
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
          <button type="button" onClick={() => void refetch()}>
            {t('common.retry')}
          </button>
        </Alert>
      </main>
    );
  }

  if (!client) {
    return (
      <main>
        <p>
          <Link to={paths.clients}>{t('common.clients')}</Link>
        </p>
        <h1>{t('clients.notFound')}</h1>
        <p>{t('clients.notFoundPeriod')}</p>
      </main>
    );
  }

  return (
    <main className="client-hub">
      <p>
        <Link to={paths.clients}>{t('common.clients')}</Link>
      </p>
      <h1>{client.name}</h1>
      <p className="text-muted">{client.notes ? client.notes : t('clients.notesEmpty')}</p>
      {canManage ? <ClientManageForm client={client} /> : null}

      <div className="hub-grid">
        <HubProjects clientId={clientId} />
        <HubTickets clientId={clientId} />
        <HubUsers clientId={clientId} />
      </div>
    </main>
  );
}

function HubProjects({ clientId }: { clientId: string }) {
  const { data, isPending, isError, error, refetch } = useProjects(clientId);
  const { t } = useI18n();

  return (
    <section>
      <h2>{t('common.projects')}</h2>
      {isPending ? <ListSkeleton label={t('projects.loading')} rows={3} /> : null}
      {isError ? (
        <Alert>
          <p>{t('projects.loadError', { message: error instanceof Error ? error.message : '' })}</p>
          <button type="button" onClick={() => void refetch()}>
            {t('common.retry')}
          </button>
        </Alert>
      ) : null}
      {data && data.length === 0 ? <p>{t('projects.empty')}</p> : null}
      {data && data.length > 0 ? (
        <ul>
          {data.map((project) => (
            <li key={project.id}>
              <Link to={projectPath(clientId, project.id)}>{project.name}</Link>
            </li>
          ))}
        </ul>
      ) : null}
      <p>
        <Link to={clientProjectsPath(clientId)}>{t('clients.viewProjects')}</Link>
      </p>
    </section>
  );
}

function HubTickets({ clientId }: { clientId: string }) {
  const { data, isPending, isError, error, refetch } = useStaffTickets(clientId);
  const { t } = useI18n();

  return (
    <section>
      <h2>{t('common.tickets')}</h2>
      {isPending ? <ListSkeleton label={t('tickets.loading')} rows={3} /> : null}
      {isError ? (
        <Alert>
          <p>{t('tickets.loadError', { message: error instanceof Error ? error.message : '' })}</p>
          <button type="button" onClick={() => void refetch()}>
            {t('common.retry')}
          </button>
        </Alert>
      ) : null}
      {data ? <p>{t('clients.ticketCount', { count: data.length })}</p> : null}
      {data && data.length === 0 ? <p>{t('tickets.empty')}</p> : null}
      {data && data.length > 0 ? (
        <ul>
          {data.slice(0, 5).map((ticket) => (
            <li key={ticket.id}>{ticket.title}</li>
          ))}
        </ul>
      ) : null}
      <p>
        <Link to={clientTicketsPath(clientId)}>{t('clients.viewTickets')}</Link>
      </p>
    </section>
  );
}

function HubUsers({ clientId }: { clientId: string }) {
  const { data, isPending, isError, error, refetch } = useClientUsers(clientId);
  const { t } = useI18n();

  return (
    <section>
      <h2>{t('clientUsers.title')}</h2>
      {isPending ? <ListSkeleton label={t('clientUsers.loading')} rows={3} /> : null}
      {isError ? (
        <Alert>
          <p>
            {t('clientUsers.loadError', { message: error instanceof Error ? error.message : '' })}
          </p>
          <button type="button" onClick={() => void refetch()}>
            {t('common.retry')}
          </button>
        </Alert>
      ) : null}
      {data ? <p>{t('clients.userCount', { count: data.length })}</p> : null}
      {data && data.length === 0 ? <p>{t('clientUsers.empty')}</p> : null}
      {data && data.length > 0 ? (
        <ul>
          {data.map((user) => (
            <li key={user.user_id}>{user.email}</li>
          ))}
        </ul>
      ) : null}
      <p>
        <Link to={clientUsersPath(clientId)}>{t('clients.viewUsers')}</Link>
      </p>
    </section>
  );
}
