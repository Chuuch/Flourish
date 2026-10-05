import { useForm } from 'react-hook-form';
import type { TicketCommentSource } from '../api/ticket-comments.api';
import { useCreateTicketComment } from '../hooks/useCreateTicketComment';
import {
  createTicketCommentSchema,
  type CreateTicketCommentInput,
} from '../schemas/ticket-comment.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, TextArea } from '@/components/ui';
import { useI18n } from '@/features/i18n';

export function CreateTicketCommentForm({
  ticketId,
  source = 'portal',
}: {
  ticketId: string;
  source?: TicketCommentSource;
}) {
  const createComment = useCreateTicketComment(ticketId, source);
  const { t } = useI18n();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTicketCommentInput>({
    resolver: zodResolver(createTicketCommentSchema),
    defaultValues: { body: '' },
  });

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
      <TextArea
        id={`ticket-comment-${ticketId}`}
        label={t('tickets.comment')}
        rows={3}
        error={errors.body?.message}
        {...register('body')}
      />

      {createComment.isError ? <Alert>{createComment.error.message}</Alert> : null}

      <div className="form-actions">
        <Button type="submit" disabled={createComment.isPending}>
          {t('comments.add')}
        </Button>
      </div>
    </form>
  );
}
