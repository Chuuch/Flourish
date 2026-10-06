import { useState } from 'react';
import { Link } from 'react-router';
import { Alert, Button } from '@/components/ui';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { useI18n } from '@/features/i18n';
import { clientTicketsPath } from '@/app/router/paths';
import { useClients } from '@/features/clients/hooks/useClients';
import { useOrgTickets } from '../hooks/useOrgTickets';
import type { Ticket, TicketStatus } from '../schemas/ticket.schema';
import { AgencyTicketList } from './AgencyTicketList';

function ticketStatusLabel(
  status: TicketStatus,
  t: (
    key:
      | 'tickets.status.open'
      | 'tickets.status.inProgress'
      | 'tickets.status.resolved'
      | 'tickets.status.closed',
  ) => string,
): string {
  switch (status) {
    case 'in_progress':
      return t('tickets.status.inProgress');
    case 'resolved':
      return t('tickets.status.resolved');
    case 'closed':
      return t('tickets.status.closed');
    default:
      return t('tickets.status.open');
  }
}

export function OrgTicketList() {
  const { data, isPending, isError, error, refetch } = useOrgTickets();
  const clients = useClients();
  const [focusClientId, setFocusClientId] = useState<string | null>(null);
  const { t } = useI18n();

  if (focusClientId) {
    return (
      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="self-start px-0"
          onClick={() => {
            setFocusClientId(null);
          }}
        >
          {t('tickets.back')}
        </Button>
        <AgencyTicketList clientId={focusClientId} />
      </div>
    );
  }

  if (isPending) {
    return <ListSkeleton label={t('tickets.loading')} />;
  }

  if (isError) {
    return (
      <Alert>
        <p>{t('tickets.loadError', { message: error.message })}</p>
        <Button type="button" variant="ghost" size="sm" onClick={() => void refetch()}>
          {t('common.retry')}
        </Button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p className="text-muted m-0 text-sm">{t('tickets.empty')}</p>;
  }

  const clientName = (ticket: Ticket) =>
    clients.data?.find((client) => client.id === ticket.client_id)?.name ?? ticket.client_id;

  return (
    <ul className="stack-list">
      {data.map((ticket) => (
        <li key={ticket.id} className="p-0!">
          <button
            type="button"
            className="hover:bg-canvas-elevated/60 flex w-full cursor-pointer items-start justify-between gap-3 px-[0.9rem] py-3 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:shadow-(--focus-ring)"
            onClick={() => {
              setFocusClientId(ticket.client_id);
            }}
          >
            <span className="min-w-0">
              <span className="text-muted mb-0.5 block text-xs font-medium">
                <Link
                  to={clientTicketsPath(ticket.client_id)}
                  className="hover:underline"
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  {clientName(ticket)}
                </Link>
              </span>
              <span className="block truncate text-sm font-semibold text-ink">
                {ticket.title}
                <span className="text-muted font-medium"> ({ticket.kind})</span>
              </span>
            </span>
            <span className="text-muted shrink-0 text-xs font-medium tabular-nums">
              {ticketStatusLabel(ticket.status, t)}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
