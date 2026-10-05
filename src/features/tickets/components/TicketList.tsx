import { Alert, Button } from '@/components/ui';
import { useTickets } from '../hooks/useTickets';
import { CreateTicketFileForm } from './CreateTicketFileForm';
import { TicketFileList } from './TicketFileList';
import { TicketCommentList } from './TicketCommentList';
import { CreateTicketCommentForm } from './CreateTicketCommentForm';
import { useI18n } from '@/features/i18n';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';

export function TicketList() {
  const { data, isPending, isError, error, refetch } = useTickets();
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
