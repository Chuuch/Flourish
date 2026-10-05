import { useForm } from 'react-hook-form';
import { useCreateTimeEntry } from '../hooks/useCreateTimeEntry';
import { createTimeEntrySchema, type CreateTimeEntryInput } from '../schemas/time-entry.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, TextArea, TextField } from '@/components/ui';
import { useI18n } from '@/features/i18n';

export function CreateTimeEntryForm({ taskId }: { taskId: string }) {
  const createTimeEntry = useCreateTimeEntry(taskId);
  const { t } = useI18n();

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
        label={t('time.minutes')}
        type="number"
        autoComplete="off"
        error={errors.minutes?.message}
        {...register('minutes', { valueAsNumber: true })}
      />
      <TextArea label={t('tasks.notes')} error={errors.notes?.message} {...register('notes')} />

      {createTimeEntry.isError ? <Alert>{createTimeEntry.error.message}</Alert> : null}

      <div className="form-actions">
        <Button type="submit" disabled={createTimeEntry.isPending}>
          {t('time.add')}
        </Button>
      </div>
    </form>
  );
}
