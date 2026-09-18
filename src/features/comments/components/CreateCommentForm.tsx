import { useForm } from 'react-hook-form';
import { useCreateComment } from '../hooks/useCreateComment';
import { createCommentSchema, type CreateCommentInput } from '../schemas/comment.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button } from '@/components/ui';

export function CreateCommentForm({ taskId }: { taskId: string }) {
  const createComment = useCreateComment(taskId);

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
      <div>
        <label htmlFor="body">Body</label>
        <textarea id="body" className="block rounded border px-2 py-1" {...register('body')} />
        {errors.body ? <p role="alert">{errors.body.message}</p> : null}

        {createComment.isError ? <Alert>{createComment.error.message}</Alert> : null}

        <Button type="submit" disabled={createComment.isPending}>
          Add comment
        </Button>
      </div>
    </form>
  );
}
