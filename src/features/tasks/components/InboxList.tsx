import { Alert, Button, SelectField } from '@/components/ui';
import { useInbox } from '../hooks/useInbox';
import { useUpdateTask } from '../hooks/useUpdateTask';
import { taskStatusSchema, type TaskStatus } from '../schemas/task.schema';
import { EditTaskForm } from './EditTaskForm';
import { useI18n } from '@/features/i18n';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';

export function InboxList() {
  const { data, isPending, isError, error, refetch } = useInbox();
  const updateTask = useUpdateTask();
  const { t } = useI18n();

  if (isPending) {
    return <ListSkeleton label={t('inbox.loading')} />;
  }

  if (isError) {
    return (
      <Alert>
        <p>{t('inbox.loadError', { message: error.message })}</p>
        <Button type="button" variant="ghost" size="sm" onClick={() => void refetch()}>
          {t('common.retry')}
        </Button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p className="text-muted m-0 text-sm">{t('inbox.empty')}</p>;
  }

  return (
    <>
      {updateTask.isError ? <Alert>{updateTask.error.message}</Alert> : null}
      <ul>
        {data.map((task) => (
          <li key={task.id}>
            <div className="flex flex-col gap-3">
              <div>
                <p className="m-0 text-sm font-semibold">{task.title}</p>
                {task.notes ? <p className="text-muted m-0 mt-1 text-sm">{task.notes}</p> : null}
              </div>
              <SelectField
                label={t('tasks.statusFor', { title: task.title })}
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
              </SelectField>
              <EditTaskForm task={task} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
