import { Alert } from '@/components/ui';
import { useTasks } from '../hooks/useTasks';
import { Link } from 'react-router';
import { taskTimeEntriesPath } from '@/app/router/paths';

export function TaskList({ projectId, clientId }: { projectId: string; clientId: string }) {
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
          <Link to={taskTimeEntriesPath(clientId, projectId, task.id)}>
            {task.notes ? `${task.title} - ${task.notes}` : task.title} ({task.status})
          </Link>
        </li>
      ))}
    </ul>
  );
}
