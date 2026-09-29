import { useMemo, useState } from 'react';
import { Alert } from '@/components/ui';
import { useAuthStore } from '@/features/auth';
import { useInbox } from '../hooks/useInbox';
import { useUpdateTask } from '../hooks/useUpdateTask';
import { taskStatusSchema, type TaskStatus } from '../schemas/task.schema';
import { EditTaskForm } from './EditTaskForm';
import { useI18n } from '@/features/i18n';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';

type InboxFilter = 'all' | 'mine' | 'unassigned';

export function InboxList() {
  const userId = useAuthStore((state) => state.user?.id);
  const { data, isPending, isError, error, refetch } = useInbox();
  const updateTask = useUpdateTask();
  const { t } = useI18n();
  const [filter, setFilter] = useState<InboxFilter>('all');

  const tasks = useMemo(() => {
    if (!data) {
      return [];
    }

    if (filter === 'mine') {
      return data.filter((task) => task.assignee_id === userId);
    }

    if (filter === 'unassigned') {
      return data.filter((task) => task.assignee_id === null);
    }

    return data;
  }, [data, filter, userId]);

  if (isPending) {
    return <ListSkeleton label={t('inbox.loading')} />;
  }

  if (isError) {
    return (
      <Alert>
        <p>{t('inbox.loadError', { message: error instanceof Error ? error.message : '' })}</p>
        <button type="button" onClick={() => void refetch()}>
          {t('common.retry')}
        </button>
      </Alert>
    );
  }

  return (
    <>
      <fieldset className="inbox-filters">
        <legend>{t('inbox.filter')}</legend>
        <label>
          <input
            type="radio"
            name="inbox-filter"
            checked={filter === 'all'}
            onChange={() => {
              setFilter('all');
            }}
          />
          {t('inbox.filterAll')}
        </label>
        <label>
          <input
            type="radio"
            name="inbox-filter"
            checked={filter === 'mine'}
            onChange={() => {
              setFilter('mine');
            }}
          />
          {t('inbox.filterMine')}
        </label>
        <label>
          <input
            type="radio"
            name="inbox-filter"
            checked={filter === 'unassigned'}
            onChange={() => {
              setFilter('unassigned');
            }}
          />
          {t('inbox.filterUnassigned')}
        </label>
      </fieldset>

      {updateTask.isError ? <Alert>{updateTask.error.message}</Alert> : null}

      {tasks.length === 0 ? (
        <p>{t('inbox.empty')}</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <p>{task.notes ? `${task.title} - ${task.notes}` : task.title}</p>
              <label>
                {t('tasks.statusFor', { title: task.title })}
                <select
                  value={task.status}
                  disabled={updateTask.isPending}
                  onChange={(event) => {
                    const parsed = taskStatusSchema.safeParse(event.currentTarget.value);

                    if (!parsed.success) {
                      return;
                    }

                    const status: TaskStatus = parsed.data;
                    updateTask.mutate({
                      taskId: task.id,
                      input: { status, version: task.version },
                    });
                  }}
                >
                  <option value="todo">{t('tasks.todo')}</option>
                  <option value="in_progress">{t('tasks.inProgress')}</option>
                  <option value="done">{t('tasks.done')}</option>
                </select>
              </label>
              <EditTaskForm task={task} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
