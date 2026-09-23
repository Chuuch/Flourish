import { useForm } from 'react-hook-form';
import type { TicketCommentSource } from '../api/ticket-comments.api';
import { useCreateTicketComment } from '../hooks/useCreateTicketComment';
import {
  createTicketCommentSchema,
  type CreateTicketCommentInput,
} from '../schemas/ticket-comment.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button } from '@/components/ui';

export function CreateTicketCommentForm({
  ticketId,
  source = 'portal',
}: {
  ticketId: string;
  source?: TicketCommentSource;
}) {
  const createComment = useCreateTicketComment(ticketId, source);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTicketCommentInput>({
    resolver: zodResolver(createTicketCommentSchema),
    defaultValues: { body: '' },
  });

  const fieldId = `ticket-comment-${ticketId}`;

  return (
    <form
      onSubmit={(event) =>
        void handleSubmit((input) => {
          createComment.mutate(input, {
            onSuccess: () => {
              reset();
            },
          });
        })(event)
      }
      noValidate
    >
      <div>
        <label htmlFor={fieldId}>Comment</label>
        <textarea id={fieldId} className="block rounded border px-2 py-1" {...register('body')} />
        {errors.body ? <p role="alert">{errors.body.message}</p> : null}

        {createComment.isError ? <Alert>{createComment.error.message}</Alert> : null}

        <Button type="submit" disabled={createComment.isPending}>
          Add comment
        </Button>
      </div>
    </form>
  );
}
