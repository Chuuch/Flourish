import { Alert } from '@/components/ui';
import { useTickets } from '../hooks/useTickets';
import { CreateTicketFileForm } from './CreateTicketFileForm';
import { TicketFileList } from './TicketFileList';
import { TicketCommentList } from './TicketCommentList';
import { CreateTicketCommentForm } from './CreateTicketCommentForm';
import { useI18n } from '@/features/i18n';

export function TicketList() {
  const { data, isPending, isError, error, refetch } = useTickets();
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
    <ul>
      {data.map((ticket) => (
        <li key={ticket.id}>
          <p>{`${ticket.title} (${ticket.kind}) — ${ticket.status}`}</p>
          <p>{ticket.body}</p>
          <TicketFileList ticketId={ticket.id} />
          <CreateTicketFileForm ticketId={ticket.id} />
          <TicketCommentList ticketId={ticket.id} />
          <CreateTicketCommentForm ticketId={ticket.id} />
        </li>
      ))}
    </ul>
  );
}
