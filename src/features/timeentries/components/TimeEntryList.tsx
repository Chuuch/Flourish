import { Alert, Button, TextArea, TextField } from '@/components/ui';
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
import { ListSkeleton } from '@/components/feedback/ListSkeleton';

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
    <div className="mt-3 flex flex-col gap-3">
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
        <TextArea
          label={t('time.notesFor', { label })}
          error={errors.notes?.message}
          {...register('notes')}
        />

        <div className="form-actions">
          <Button type="submit" disabled={updateTimeEntry.isPending}>
            {t('time.save', { label })}
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={deleteTimeEntry.isPending}
            onClick={() => {
              deleteTimeEntry.mutate(entry.id);
            }}
          >
            {t('time.remove', { label })}
          </Button>
        </div>
      </form>
    </div>
  );
}

export function TimeEntryList({ taskId }: { taskId: string }) {
  const role = useAuthStore((state) => state.role);
  const actorUserId = useAuthStore((state) => state.user?.id);
  const { data, isPending, isError, error, refetch } = useTimeEntries(taskId);
  const { t } = useI18n();

  if (isPending) {
    return <ListSkeleton label={t('time.loading')} />;
  }

  if (isError) {
    return (
      <Alert>
        <p>{t('time.loadError', { message: error.message })}</p>
        <Button type="button" variant="ghost" size="sm" onClick={() => void refetch()}>
          {t('common.retry')}
        </Button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p className="text-muted m-0 text-sm">{t('time.empty')}</p>;
  }

  return (
    <ul>
      {data.map((entry) => (
        <li key={entry.id}>
          <p className="m-0 text-sm font-medium">{timeEntryLabel(entry)}</p>
          {canMutateTimeEntry(role, actorUserId, entry.user_id) ? (
            <TimeEntryManageForm taskId={taskId} entry={entry} />
          ) : null}
        </li>
      ))}
    </ul>
  );
}
