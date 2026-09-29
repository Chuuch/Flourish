import { Alert, Button } from '@/components/ui';
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
        <button type="button" onClick={() => void refetch()}>
          {t('common.retry')}
        </button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p>{t('tasks.empty')}</p>;
  }

  return (
    <>
      {updateTask.isError ? <Alert>{updateTask.error.message}</Alert> : null}
      {deleteTask.isError ? <Alert>{deleteTask.error.message}</Alert> : null}
      <ul>
        {data.map((task) => (
          <li key={task.id}>
            <Link to={taskPath(clientId, projectId, task.id)}>
              {task.notes ? `${task.title} - ${task.notes}` : task.title}
            </Link>{' '}
            <Link to={taskCommentsPath(clientId, projectId, task.id)}>{t('common.comments')}</Link>{' '}
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
            {task.completed_at ? (
              <span>{t('tasks.completed', { completedAt: task.completed_at })}</span>
            ) : null}
            <EditTaskForm task={task} projectId={projectId} />
            {canManage ? (
              <Button
                type="button"
                disabled={deleteTask.isPending}
                onClick={() => {
                  deleteTask.mutate(task.id);
                }}
              >
                {t('tasks.remove', { title: task.title })}
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </>
  );
}
