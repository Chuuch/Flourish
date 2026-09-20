import { useForm } from 'react-hook-form';
import { useCreateTimeEntry } from '../hooks/useCreateTimeEntry';
import { createTimeEntrySchema, type CreateTimeEntryInput } from '../schemas/time-entry.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, TextField } from '@/components/ui';

export function CreateTimeEntryForm({ taskId }: { taskId: string }) {
  const createTimeEntry = useCreateTimeEntry(taskId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTimeEntryInput>({
    resolver: zodResolver(createTimeEntrySchema),
    defaultValues: { minutes: 0, notes: '' },
  });

  return (
    <form
      onSubmit={(event) =>
        void handleSubmit((input) => {
          createTimeEntry.mutate(input, {
            onSuccess: () => {
              reset();
            },
          });
        })(event)
      }
      noValidate
    >
      <TextField
        label="Minutes"
        type="number"
        autoComplete="off"
        error={errors.minutes?.message}
        {...register('minutes', { valueAsNumber: true })}
      />

      <div>
        <label htmlFor="notes">Notes</label>
        <textarea id="notes" className="block rounded border px-2 py-1" {...register('notes')} />
        {errors.notes ? <p role="alert">{errors.notes.message}</p> : null}

        {createTimeEntry.isError ? <Alert>{createTimeEntry.error.message}</Alert> : null}

        <Button type="submit" disabled={createTimeEntry.isPending}>
          Add time
        </Button>
      </div>
    </form>
  );
}
