import { Alert, Button } from '@/components/ui';
import { useTasks } from '../hooks/useTasks';
import { Link } from 'react-router';
import { taskCommentsPath, taskTimeEntriesPath } from '@/app/router/paths';
import { useUpdateTask } from '../hooks/useUpdateTask';
import { canManageTasks, taskStatusSchema, type TaskStatus } from '../schemas/task.schema';
import { useAuthStore } from '@/features/auth';
import { useDeleteTask } from '../hooks/useDeleteTask';

export function TaskList({ projectId, clientId }: { projectId: string; clientId: string }) {
  const role = useAuthStore((state) => state.role);
  const canManage = canManageTasks(role);
  const { data, isPending, isError, error, refetch } = useTasks(projectId);
  const updateTask = useUpdateTask(projectId);
  const deleteTask = useDeleteTask(projectId);

  if (isPending) {
    return <p role="status">Loading tasks ....</p>;
  }

  if (isError) {
    return (
      <Alert>
        <p>Could not load tasks: {error.message}</p>
        <button type="button" onClick={() => void refetch()}>
          Retry
        </button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p>No tasks yet.</p>;
  }

  return (
    <>
      {updateTask.isError ? <Alert>{updateTask.error.message}</Alert> : null}
      {deleteTask.isError ? <Alert>{deleteTask.error.message}</Alert> : null}
      <ul>
        {data.map((task) => (
          <li key={task.id}>
            <Link to={taskTimeEntriesPath(clientId, projectId, task.id)}>
              {task.notes ? `${task.title} - ${task.notes}` : task.title}
            </Link>{' '}
            <Link to={taskCommentsPath(clientId, projectId, task.id)}>Comments</Link>{' '}
            <label>
              Status for {task.title}
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
                <option value="todo">Todo</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </label>
            {task.completed_at ? <span> Completed {task.completed_at}</span> : null}
            {canManage ? (
              <Button
                type="button"
                disabled={deleteTask.isPending}
                onClick={() => {
                  deleteTask.mutate(task.id);
                }}
              >
                {`Remove ${task.title}`}
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </>
  );
}
