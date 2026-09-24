import { Alert, Button } from '@/components/ui';
import type { TicketCommentSource } from '../api/ticket-comments.api';
import { useTicketComments } from '../hooks/useTicketComments';
import {
  canMutateTicketComment,
  ticketCommentLabel,
  updateTicketCommentSchema,
  type TicketComment,
  type UpdateTicketCommentInput,
} from '../schemas/ticket-comment.schema';
import { useUpdateTicketComment } from '../hooks/useUpdateTicketComment';
import { useDeleteTicketComment } from '../hooks/useDeleteTicketComment';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/features/auth';

function TicketCommentManageForm({
  ticketId,
  source,
  comment,
}: {
  ticketId: string;
  source: TicketCommentSource;
  comment: TicketComment;
}) {
  const updateComment = useUpdateTicketComment(ticketId, source);
  const deleteComment = useDeleteTicketComment(ticketId, source);
  const label = ticketCommentLabel(comment);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateTicketCommentInput>({
    resolver: zodResolver(updateTicketCommentSchema),
    values: { body: comment.body },
  });

  return (
    <>
      {updateComment.isError ? <Alert>{updateComment.error.message}</Alert> : null}
      {deleteComment.isError ? <Alert>{deleteComment.error.message}</Alert> : null}
      <form
        onSubmit={(event) =>
          void handleSubmit((input) => {
            updateComment.mutate({ commentId: comment.id, input });
          })(event)
        }
        noValidate
      >
        <div>
          <label htmlFor={`ticket-comment-edit-${comment.id}`}>Comment for {label}</label>
          <textarea
            id={`ticket-comment-edit-${comment.id}`}
            className="block rounded border px-2 py-1"
            {...register('body')}
          />
          {errors.body ? <p role="alert">{errors.body.message}</p> : null}
        </div>

        <Button type="submit" disabled={updateComment.isPending}>
          {`Save ${label}`}
        </Button>
      </form>
      <Button
        type="button"
        disabled={deleteComment.isPending}
        onClick={() => {
          deleteComment.mutate(comment.id);
        }}
      >
        {`Remove ${label}`}
      </Button>
    </>
  );
}

export function TicketCommentList({
  ticketId,
  source = 'portal',
}: {
  ticketId: string;
  source?: TicketCommentSource;
}) {
  const role = useAuthStore((state) => state.role);
  const actorUserId = useAuthStore((state) => state.user?.id);
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
          {canMutateTicketComment(role, actorUserId, comment.user_id) ? (
            <TicketCommentManageForm ticketId={ticketId} source={source} comment={comment} />
          ) : null}
        </li>
      ))}
    </ul>
  );
}
