import { Alert } from '@/components/ui';
import { useInbox } from '../hooks/useInbox';
import { useUpdateTask } from '../hooks/useUpdateTask';
import { taskStatusSchema, type TaskStatus } from '../schemas/task.schema';
import { EditTaskForm } from './EditTaskForm';

export function InboxList() {
  const { data, isPending, isError, error, refetch } = useInbox();
  const updateTask = useUpdateTask();

  if (isPending) {
    return <p role="status">Loading inbox...</p>;
  }

  if (isError) {
    return (
      <Alert>
        <p>Could not load inbox: {error.message}</p>
        <button type="button" onClick={() => void refetch()}>
          Retry
        </button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p>No inbox tasks.</p>;
  }

  return (
    <>
      {updateTask.isError ? <Alert>{updateTask.error.message}</Alert> : null}
      <ul>
        {data.map((task) => (
          <li key={task.id}>
            <p>{task.notes ? `${task.title} - ${task.notes}` : task.title}</p>
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
            <EditTaskForm task={task} />
          </li>
        ))}
      </ul>
    </>
  );
}
