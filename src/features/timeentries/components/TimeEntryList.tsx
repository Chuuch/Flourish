import { Alert, Button, TextField } from '@/components/ui';
import { useTimeEntries } from '../hooks/useTimeEntries';
import {
  canMutateTimeEntry,
  timeEntryLabel,
  updateTimeEntrySchema,
  type TimeEntry,
  type UpdateTimeEntryInput,
} from '../schemas/time-entry.schema';
import { useUpdateTimeEntry } from '../hooks/useUpdateTimeEntry';
import { useDeleteTimeEntry } from '../hooks/useDeleteTimeEntry';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/features/auth';
import { useI18n } from '@/features/i18n';

function TimeEntryManageForm({ taskId, entry }: { taskId: string; entry: TimeEntry }) {
  const updateTimeEntry = useUpdateTimeEntry(taskId);
  const deleteTimeEntry = useDeleteTimeEntry(taskId);
  const label = timeEntryLabel(entry);
  const { t } = useI18n();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateTimeEntryInput>({
    resolver: zodResolver(updateTimeEntrySchema),
    values: { minutes: entry.minutes, notes: entry.notes },
  });

  return (
    <>
      {updateTimeEntry.isError ? <Alert>{updateTimeEntry.error.message}</Alert> : null}
      {deleteTimeEntry.isError ? <Alert>{deleteTimeEntry.error.message}</Alert> : null}
      <form
        onSubmit={(event) =>
          void handleSubmit((input) => {
            updateTimeEntry.mutate({ entryId: entry.id, input });
          })(event)
        }
        noValidate
      >
        <TextField
          label={t('time.minutesFor', { label })}
          type="number"
          autoComplete="off"
          error={errors.minutes?.message}
          {...register('minutes', { valueAsNumber: true })}
        />

        <div>
          <label htmlFor={`notes-${entry.id}`}>{t('time.notesFor', { label })}</label>
          <textarea
            id={`notes-${entry.id}`}
            className="block rounded border px-2 py-1"
            {...register('notes')}
          />
          {errors.notes ? <p role="alert">{errors.notes.message}</p> : null}
        </div>

        <Button type="submit" disabled={updateTimeEntry.isPending}>
          {t('time.save', { label })}
        </Button>
      </form>
      <Button
        type="button"
        disabled={deleteTimeEntry.isPending}
        onClick={() => {
          deleteTimeEntry.mutate(entry.id);
        }}
      >
        {t('time.remove', { label })}
      </Button>
    </>
  );
}

export function TimeEntryList({ taskId }: { taskId: string }) {
  const role = useAuthStore((state) => state.role);
  const actorUserId = useAuthStore((state) => state.user?.id);
  const { data, isPending, isError, error, refetch } = useTimeEntries(taskId);
  const { t } = useI18n();

  if (isPending) {
    return <p role="status">{t('time.loading')}</p>;
  }

  if (isError) {
    return (
      <Alert>
        <p>{t('time.loadError', { message: error.message })}</p>
        <button type="button" onClick={() => void refetch()}>
          {t('common.retry')}
        </button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p>{t('time.empty')}</p>;
  }

  return (
    <ul>
      {data.map((entry) => (
        <li key={entry.id}>
          {timeEntryLabel(entry)}
          {canMutateTimeEntry(role, actorUserId, entry.user_id) ? (
            <TimeEntryManageForm taskId={taskId} entry={entry} />
          ) : null}
        </li>
      ))}
    </ul>
  );
}
