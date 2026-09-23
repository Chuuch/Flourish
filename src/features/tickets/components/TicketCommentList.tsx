import { Alert } from '@/components/ui';
import type { TicketCommentSource } from '../api/ticket-comments.api';
import { useTicketComments } from '../hooks/useTicketComments';

export function TicketCommentList({
  ticketId,
  source = 'portal',
}: {
  ticketId: string;
  source?: TicketCommentSource;
}) {
  const { data, isPending, error, isError, refetch } = useTicketComments(ticketId, source);

  if (isPending) {
    return <p role="status">Loading comments...</p>;
  }

  if (isError) {
    return (
      <Alert>
        <p>Could not load comments: {error.message}</p>
        <button type="button" onClick={() => void refetch()}>
          Retry
        </button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p>No comments yet.</p>;
  }

  return (
    <ul>
      {data.map((comment) => (
        <li key={comment.id}>
          <span>
            {comment.user_id} - {comment.body}
          </span>
        </li>
      ))}
    </ul>
  );
}
