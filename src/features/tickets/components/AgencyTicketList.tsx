import { Alert, Button } from '@/components/ui';
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

export function AgencyTicketList({ clientId }: { clientId: string }) {
  const role = useAuthStore((state) => state.role);
  const canManage = canManageTasks(role);
  const { data, isPending, isError, error, refetch } = useStaffTickets(clientId);
  const updateTicket = useUpdateTicket(clientId);
  const deleteTicket = useDeleteTicket(clientId);
  const { t } = useI18n();

  if (isPending) {
    return <p role="status">{t('tickets.loading')}</p>;
  }

  if (isError) {
    return (
      <Alert>
        <p>{t('tickets.loadError', { message: error.message })}</p>
        <button type="button" onClick={() => void refetch()}>
          {t('common.retry')}
        </button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p>{t('tickets.empty')}</p>;
  }

  return (
    <>
      {updateTicket.isError ? <Alert>{updateTicket.error.message}</Alert> : null}
      {deleteTicket.isError ? <Alert>{deleteTicket.error.message}</Alert> : null}
      <ul>
        {data.map((ticket) => (
          <li key={ticket.id}>
            <p>{`${ticket.title} (${ticket.kind})`}</p>
            <p>{ticket.body}</p>
            <label>
              {t('tickets.statusFor', { title: ticket.title })}
              <select
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
              </select>
            </label>
            {canManage ? (
              <Button
                type="button"
                disabled={deleteTicket.isPending}
                onClick={() => {
                  deleteTicket.mutate(ticket.id);
                }}
              >
                {t('tickets.remove', { title: ticket.title })}
              </Button>
            ) : null}
            <ConvertTicketForm
              clientId={clientId}
              ticketId={ticket.id}
              ticketTitle={ticket.title}
            />
            <TicketFileList ticketId={ticket.id} source="staff" />
            <CreateTicketFileForm ticketId={ticket.id} source="staff" />
            <TicketCommentList ticketId={ticket.id} source="staff" />
            <CreateTicketCommentForm ticketId={ticket.id} source="staff" />
          </li>
        ))}
      </ul>
    </>
  );
}
