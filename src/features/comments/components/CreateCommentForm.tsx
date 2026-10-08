import { useForm } from 'react-hook-form';
import { useCreateComment } from '../hooks/useCreateComment';
import { createCommentSchema, type CreateCommentInput } from '../schemas/comment.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, TextArea } from '@/components/ui';
import { useI18n } from '@/features/i18n';

export function CreateCommentForm({ taskId }: { taskId: string }) {
  const createComment = useCreateComment(taskId);
  const { t } = useI18n();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCommentInput>({
    resolver: zodResolver(createCommentSchema),
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
      <TextArea label={t('comments.body')} error={errors.body?.message} {...register('body')} />

      {createComment.isError ? <Alert>{createComment.error.message}</Alert> : null}

      <div className="form-actions">
        <Button type="submit" disabled={createComment.isPending}>
          {t('comments.add')}
        </Button>
      </div>
    </form>
  );
}
