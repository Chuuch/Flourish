import { Alert, Button, SelectField } from '@/components/ui';
import { useTasks } from '../hooks/useTasks';
import { Link } from 'react-router';
import { taskCommentsPath, taskPath } from '@/app/router/paths';
import { useUpdateTask } from '../hooks/useUpdateTask';
import { canManageTasks, taskStatusSchema, type TaskStatus } from '../schemas/task.schema';
import { useAuthStore } from '@/features/auth';
import { useDeleteTask } from '../hooks/useDeleteTask';
import { EditTaskForm } from './EditTaskForm';
import { useI18n } from '@/features/i18n';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';

export function TaskList({ projectId, clientId }: { projectId: string; clientId: string }) {
  const role = useAuthStore((state) => state.role);
  const canManage = canManageTasks(role);
  const { data, isPending, isError, error, refetch } = useTasks(projectId);
  const updateTask = useUpdateTask(projectId);
  const deleteTask = useDeleteTask(projectId);
  const { t } = useI18n();

  if (isPending) {
    return <ListSkeleton label={t('tasks.loading')} />;
  }

  if (isError) {
    return (
      <Alert>
        <p>{t('tasks.loadError', { message: error instanceof Error ? error.message : '' })}</p>
        <Button type="button" variant="ghost" size="sm" onClick={() => void refetch()}>
          {t('common.retry')}
        </Button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p className="text-muted m-0 text-sm">{t('tasks.empty')}</p>;
  }

  return (
    <>
      {updateTask.isError ? <Alert>{updateTask.error.message}</Alert> : null}
      {deleteTask.isError ? <Alert>{deleteTask.error.message}</Alert> : null}
      <ul>
        {data.map((task) => (
          <li key={task.id}>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <Link
                    to={taskPath(clientId, projectId, task.id)}
                    className="text-ink font-semibold no-underline hover:underline"
                  >
                    {task.title}
                  </Link>
                  {task.notes ? <p className="text-muted m-0 mt-1 text-sm">{task.notes}</p> : null}
                  {task.completed_at ? (
                    <p className="text-muted m-0 mt-1 text-xs">
                      {t('tasks.completed', { completedAt: task.completed_at })}
                    </p>
                  ) : null}
                </div>
                <Link
                  to={taskCommentsPath(clientId, projectId, task.id)}
                  className="shrink-0 text-sm"
                >
                  {t('common.comments')}
                </Link>
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

              <EditTaskForm task={task} projectId={projectId} />

              {canManage ? (
                <div className="form-actions">
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    disabled={deleteTask.isPending}
                    onClick={() => {
                      deleteTask.mutate(task.id);
                    }}
                  >
                    {t('tasks.remove', { title: task.title })}
                  </Button>
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
