import { Link, useParams } from 'react-router';
import {
  clientPath,
  clientProjectsPath,
  paths,
  projectPath,
  projectTasksPath,
} from '@/app/router/paths';
import { Alert, Button } from '@/components/ui';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { useAuthStore } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { CreateCommentForm } from '@/features/comments/components/CreateCommentForm';
import { CommentList } from '@/features/comments/components/CommentList';
import { CreateTimeEntryForm } from '@/features/timeentries/components/CreateTimeEntryForm';
import { TimeEntryList } from '@/features/timeentries/components/TimeEntryList';
import { EditTaskForm } from '../components/EditTaskForm';
import { useDeleteTask } from '../hooks/useDeleteTask';
import { useTask } from '../hooks/useTask';
import { useUpdateTask } from '../hooks/useUpdateTask';
import { canManageTasks, taskStatusSchema, type TaskStatus } from '../schemas/task.schema';

export function TaskWorkspacePage() {
  const { clientId, projectId, taskid } = useParams();
  const { t } = useI18n();

  if (!clientId || !projectId || !taskid) {
    return (
      <main>
        <h1>{t('tasks.title')}</h1>
        <p>{t('tasks.missing')}</p>
      </main>
    );
  }

  return <TaskWorkspace clientId={clientId} projectId={projectId} taskId={taskid} />;
}

function TaskWorkspace({
  clientId,
  projectId,
  taskId,
}: {
  clientId: string;
  projectId: string;
  taskId: string;
}) {
  const role = useAuthStore((state) => state.role);
  const canManage = canManageTasks(role);
  const { task, isPending, isError, error, refetch } = useTask(projectId, taskId);
  const updateTask = useUpdateTask(projectId);
  const deleteTask = useDeleteTask(projectId);
  const { t } = useI18n();

  if (isPending) {
    return (
      <main>
        <ListSkeleton label={t('tasks.loading')} />
      </main>
    );
  }

  if (isError) {
    const message = error instanceof Error ? error.message : '';

    return (
      <main>
        <Alert>
          <p>{t('tasks.loadError', { message })}</p>
          <Button type="button" variant="ghost" size="sm" onClick={() => void refetch()}>
            {t('common.retry')}
          </Button>
        </Alert>
      </main>
    );
  }

  if (!task) {
    return (
      <main>
        <p>
          <Link to={paths.clients}>{t('common.clients')}</Link>
          {' / '}
          <Link to={clientPath(clientId)}>{t('clients.hubCrumb')}</Link>
          {' / '}
          <Link to={clientProjectsPath(clientId)}>{t('common.projects')}</Link>
          {' / '}
          <Link to={projectPath(clientId, projectId)}>{t('projects.hubCrumb')}</Link>
          {' / '}
          <Link to={projectTasksPath(clientId, projectId)}>{t('common.tasks')}</Link>
        </p>
        <h1>{t('tasks.missing')}</h1>
      </main>
    );
  }

  return (
    <main className="client-hub">
      <p>
        <Link to={paths.clients}>{t('common.clients')}</Link>
        {' / '}
        <Link to={clientPath(clientId)}>{t('clients.hubCrumb')}</Link>
        {' / '}
        <Link to={clientProjectsPath(clientId)}>{t('common.projects')}</Link>
        {' / '}
        <Link to={projectPath(clientId, projectId)}>{t('projects.hubCrumb')}</Link>
        {' / '}
        <Link to={projectTasksPath(clientId, projectId)}>{t('common.tasks')}</Link>
      </p>
      <h1>{task.title}</h1>
      <p className="text-muted">{task.notes ? task.notes : t('tasks.notesEmpty')}</p>
      {updateTask.isError ? <Alert>{updateTask.error.message}</Alert> : null}
      {deleteTask.isError ? <Alert>{deleteTask.error.message}</Alert> : null}
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

      <div className="hub-grid hub-grid-2">
        <section>
          <h2>{t('comments.title')}</h2>
          <CreateCommentForm taskId={taskId} />
          <CommentList taskId={taskId} />
        </section>
        <section>
          <h2>{t('time.heading')}</h2>
          <CreateTimeEntryForm taskId={taskId} />
          <TimeEntryList taskId={taskId} />
        </section>
      </div>
    </main>
  );
}
