import { useState } from 'react';
import { Alert, Button } from '@/components/ui';
import { useTickets } from '../hooks/useTickets';
import { CreateTicketFileForm } from './CreateTicketFileForm';
import { TicketFileList } from './TicketFileList';
import { TicketCommentList } from './TicketCommentList';
import { CreateTicketCommentForm } from './CreateTicketCommentForm';
import { useI18n } from '@/features/i18n';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import type { Ticket, TicketStatus } from '../schemas/ticket.schema';

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

function PortalTicketDetail({ ticket, onBack }: { ticket: Ticket; onBack: () => void }) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-4">
      <div className="page-header">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="self-start px-0"
          onClick={onBack}
        >
          {t('tickets.back')}
        </Button>
        <h2 className="m-0 text-base font-semibold tracking-tight">
          {ticket.title}
          <span className="text-muted font-medium"> ({ticket.kind})</span>
        </h2>
        {ticket.body ? (
          <p className="text-muted m-0 text-sm leading-relaxed">{ticket.body}</p>
        ) : null}
        <p className="text-muted m-0 text-xs font-medium">{ticketStatusLabel(ticket.status, t)}</p>
      </div>

      <section className="flex flex-col gap-3">
        <h3 className="m-0 text-sm font-semibold tracking-tight">{t('tickets.attachment')}</h3>
        <TicketFileList ticketId={ticket.id} />
        <CreateTicketFileForm ticketId={ticket.id} />
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="m-0 text-sm font-semibold tracking-tight">{t('common.comments')}</h3>
        <TicketCommentList ticketId={ticket.id} />
        <CreateTicketCommentForm ticketId={ticket.id} />
      </section>
    </div>
  );
}

export function TicketList({ query = '' }: { query?: string }) {
  const { data, isPending, isError, error, refetch, isFetching } = useTickets(query);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const { t } = useI18n();

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
    return (
      <p className="text-muted m-0 text-sm">
        {query ? t('tickets.noMatches') : t('tickets.empty')}
      </p>
    );
  }

  const selectedTicket = selectedTicketId
    ? (data.find((ticket) => ticket.id === selectedTicketId) ?? null)
    : null;

  if (selectedTicket) {
    return (
      <PortalTicketDetail
        ticket={selectedTicket}
        onBack={() => {
          setSelectedTicketId(null);
        }}
      />
    );
  }

  return (
    <ul className={isFetching ? 'stack-list opacity-70' : 'stack-list'}>
      {data.map((ticket) => (
        <li key={ticket.id} className="!p-0">
          <button
            type="button"
            className="hover:bg-canvas-elevated/60 flex w-full cursor-pointer items-start justify-between gap-3 px-[0.9rem] py-[0.75rem] text-left transition-colors duration-150 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
            onClick={() => {
              setSelectedTicketId(ticket.id);
            }}
          >
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-ink">
                {ticket.title}
                <span className="text-muted font-medium"> ({ticket.kind})</span>
              </span>
              {ticket.body ? (
                <span className="text-muted mt-0.5 block truncate text-xs leading-relaxed">
                  {ticket.body}
                </span>
              ) : null}
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
