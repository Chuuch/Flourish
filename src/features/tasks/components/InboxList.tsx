import { Alert } from '@/components/ui';
import { useInbox } from '../hooks/useInbox';
import { useUpdateTask } from '../hooks/useUpdateTask';
import { taskStatusSchema, type TaskStatus } from '../schemas/task.schema';
import { EditTaskForm } from './EditTaskForm';
import { useI18n } from '@/features/i18n';

export function InboxList() {
  const { data, isPending, isError, error, refetch } = useInbox();
  const updateTask = useUpdateTask();
  const { t } = useI18n();

  if (isPending) {
    return <p role="status">{t('inbox.loading')}</p>;
  }

  if (isError) {
    return (
      <Alert>
        <p>{t('inbox.loadError', { message: error.message })}</p>
        <button type="button" onClick={() => void refetch()}>
          {t('common.retry')}
        </button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p>{t('inbox.empty')}</p>;
  }

  return (
    <>
      {updateTask.isError ? <Alert>{updateTask.error.message}</Alert> : null}
      <ul>
        {data.map((task) => (
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
    </>
  );
}
