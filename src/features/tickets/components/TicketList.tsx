import { Alert } from '@/components/ui';
import { useTickets } from '../hooks/useTickets';
import { CreateTicketFileForm } from './CreateTicketFileForm';
import { TicketFileList } from './TicketFileList';
import { TicketCommentList } from './TicketCommentList';
import { CreateTicketCommentForm } from './CreateTicketCommentForm';

export function TicketList() {
  const { data, isPending, isError, error, refetch } = useTickets();

  if (isPending) {
    return <p role="status">Loading tickets...</p>;
  }

  if (isError) {
    return (
      <Alert>
        <p>Could not load tickets: {error.message}</p>
        <button type="button" onClick={() => void refetch()}>
          Retry
        </button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p>No tickets yet.</p>;
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
