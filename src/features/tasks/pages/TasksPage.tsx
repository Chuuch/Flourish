import { clientProjectsPath, paths } from '@/app/router/paths';
import { Link, useParams } from 'react-router';
import { CreateTaskForm } from '../components/CreateTaskForm';
import { TaskList } from '../components/TaskList';

export function TasksPage() {
  const { clientId, projectId } = useParams();

  if (!clientId || !projectId) {
    return (
      <main>
        <h1>Tasks</h1>
        <p>Project not found.</p>
      </main>
    );
  }

  return (
    <main>
      <p>
        <Link to={paths.clients}>Clients</Link>
        {' / '}
        <Link to={clientProjectsPath(clientId)}>Projects</Link>
      </p>
      <h1>Tasks</h1>
      <CreateTaskForm projectId={projectId} />
      <TaskList clientId={clientId} projectId={projectId} />
    </main>
  );
}
