import { useState } from 'react';
import { Alert, Button, SelectField } from '@/components/ui';
import { useStaffTickets } from '../hooks/useStaffTickets';
import { useUpdateTicket } from '../hooks/useUpdateTicket';
import { ticketStatusSchema, type Ticket, type TicketStatus } from '../schemas/ticket.schema';
import { TicketFileList } from './TicketFileList';
import { CreateTicketFileForm } from './CreateTicketFileForm';
import { useAuthStore } from '@/features/auth';
import { canManageTasks } from '@/features/tasks/schemas/task.schema';
import { ConvertTicketForm } from './ConvertTicketForm';
import { TicketCommentList } from './TicketCommentList';
import { CreateTicketCommentForm } from './CreateTicketCommentForm';
import { useDeleteTicket } from '../hooks/useDeleteTicket';
import { useI18n } from '@/features/i18n';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { isVersionConflict } from '@/lib/api/versionConflict';

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

function AgencyTicketDetail({
  clientId,
  ticket,
  onBack,
  onRefresh,
}: {
  clientId: string;
  ticket: Ticket;
  onBack: () => void;
  onRefresh: () => void;
}) {
  const role = useAuthStore((state) => state.role);
  const canManage = canManageTasks(role);
  const updateTicket = useUpdateTicket(clientId);
  const deleteTicket = useDeleteTicket(clientId);
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
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="m-0 text-base font-semibold tracking-tight">
              {ticket.title}
              <span className="text-muted font-medium"> ({ticket.kind})</span>
            </h2>
            {ticket.body ? (
              <p className="text-muted m-0 mt-1 text-sm leading-relaxed">{ticket.body}</p>
            ) : null}
          </div>
          {canManage ? (
            <Button
              type="button"
              size="sm"
              variant="danger"
              disabled={deleteTicket.isPending}
              aria-label={t('tickets.remove', { title: ticket.title })}
              onClick={() => {
                deleteTicket.mutate(ticket.id);
              }}
            >
              {t('common.delete')}
            </Button>
          ) : null}
        </div>
      </div>

      {updateTicket.isError ? (
        <Alert>
          <p>
            {isVersionConflict(updateTicket.error)
              ? t('toast.versionConflict')
              : updateTicket.error.message}
          </p>
          {isVersionConflict(updateTicket.error) ? (
            <Button type="button" variant="ghost" size="sm" onClick={onRefresh}>
              {t('common.retry')}
            </Button>
          ) : null}
        </Alert>
      ) : null}
      {deleteTicket.isError ? <Alert>{deleteTicket.error.message}</Alert> : null}

      <SelectField
        label={t('tickets.statusFor', { title: ticket.title })}
        value={ticket.status}
        disabled={updateTicket.isPending}
        onChange={(event) => {
          const parsed = ticketStatusSchema.safeParse(event.currentTarget.value);

          if (!parsed.success) {
            return;
          }

          const status: TicketStatus = parsed.data;
          updateTicket.mutate({
            ticketId: ticket.id,
            input: { status, version: ticket.version },
          });
        }}
      >
        <option value="open">{t('tickets.status.open')}</option>
        <option value="in_progress">{t('tickets.status.inProgress')}</option>
        <option value="resolved">{t('tickets.status.resolved')}</option>
        <option value="closed">{t('tickets.status.closed')}</option>
      </SelectField>

      <details className="ticket-panel">
        <summary>{t('tickets.convert')}</summary>
        <ConvertTicketForm clientId={clientId} ticketId={ticket.id} ticketTitle={ticket.title} />
      </details>

      <details className="ticket-panel">
        <summary>{t('tickets.attachment')}</summary>
        <TicketFileList ticketId={ticket.id} source="staff" />
        <CreateTicketFileForm ticketId={ticket.id} source="staff" />
      </details>

      <section className="flex flex-col gap-3">
        <h3 className="m-0 text-sm font-semibold tracking-tight">{t('common.comments')}</h3>
        <TicketCommentList ticketId={ticket.id} clientId={clientId} source="staff" />
        <CreateTicketCommentForm ticketId={ticket.id} source="staff" />
      </section>
    </div>
  );
}

export function AgencyTicketList({ clientId, query = '' }: { clientId: string; query?: string }) {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useStaffTickets(clientId, query);
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

  const items = data.pages.flatMap((page) => page.items);

  if (items.length === 0) {
    return (
      <p className="text-muted m-0 text-sm">
        {query ? t('tickets.noMatches') : t('tickets.empty')}
      </p>
    );
  }

  const selectedTicket = selectedTicketId
    ? (items.find((ticket) => ticket.id === selectedTicketId) ?? null)
    : null;

  if (selectedTicket) {
    return (
      <AgencyTicketDetail
        clientId={clientId}
        ticket={selectedTicket}
        onBack={() => {
          setSelectedTicketId(null);
        }}
        onRefresh={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className={isFetching && !isFetchingNextPage ? 'stack-list opacity-70' : 'stack-list'}>
        {items.map((ticket) => (
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

      {hasNextPage ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="self-start"
          disabled={isFetchingNextPage}
          onClick={() => {
            void fetchNextPage();
          }}
        >
          {t('common.loadMore')}
        </Button>
      ) : null}
    </div>
  );
}
