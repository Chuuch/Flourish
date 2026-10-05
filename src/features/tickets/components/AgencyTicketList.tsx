import { Alert, Button, SelectField } from '@/components/ui';
import { useStaffTickets } from '../hooks/useStaffTickets';
import { useUpdateTicket } from '../hooks/useUpdateTicket';
import { ticketStatusSchema, type TicketStatus } from '../schemas/ticket.schema';
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

export function AgencyTicketList({ clientId }: { clientId: string }) {
  const role = useAuthStore((state) => state.role);
  const canManage = canManageTasks(role);
  const { data, isPending, isError, error, refetch } = useStaffTickets(clientId);
  const updateTicket = useUpdateTicket(clientId);
  const deleteTicket = useDeleteTicket(clientId);
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
    return <p className="text-muted m-0 text-sm">{t('tickets.empty')}</p>;
  }

  return (
    <>
      {updateTicket.isError ? <Alert>{updateTicket.error.message}</Alert> : null}
      {deleteTicket.isError ? <Alert>{deleteTicket.error.message}</Alert> : null}
      <ul className="ticket-list">
        {data.map((ticket) => (
          <li key={ticket.id} className="ticket-item">
            <div className="ticket-item-header">
              <div className="min-w-0">
                <p className="m-0 text-sm font-semibold">
                  {ticket.title}
                  <span className="text-muted font-medium"> ({ticket.kind})</span>
                </p>
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

            <div className="ticket-item-toolbar">
              <div className="ticket-status-field">
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
              </div>
            </div>

            <details className="ticket-panel">
              <summary>{t('tickets.convert')}</summary>
              <ConvertTicketForm
                clientId={clientId}
                ticketId={ticket.id}
                ticketTitle={ticket.title}
              />
            </details>

            <details className="ticket-panel">
              <summary>{t('tickets.attachment')}</summary>
              <TicketFileList ticketId={ticket.id} source="staff" />
              <CreateTicketFileForm ticketId={ticket.id} source="staff" />
            </details>

            <details className="ticket-panel" open>
              <summary>{t('common.comments')}</summary>
              <TicketCommentList ticketId={ticket.id} source="staff" />
              <CreateTicketCommentForm ticketId={ticket.id} source="staff" />
            </details>
          </li>
        ))}
      </ul>
    </>
  );
}
