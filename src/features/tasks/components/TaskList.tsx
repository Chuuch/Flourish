import { Alert } from '@/components/ui';
import { useTasks } from '../hooks/useTasks';

export function TaskList({ projectId }: { projectId: string }) {
  const { data, isPending, isError, error, refetch } = useTasks(projectId);

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
    <ul>
      {data.map((task) => (
        <li key={task.id}>
          {task.notes ? `${task.title} - ${task.notes}` : task.title} ({task.status})
        </li>
      ))}
    </ul>
  );
}
