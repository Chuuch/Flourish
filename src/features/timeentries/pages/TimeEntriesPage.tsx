import { clientProjectsPath, paths, projectTasksPath } from '@/app/router/paths';
import { Link, useParams } from 'react-router';
import { CreateTimeEntryForm } from '../components/CreateTimeEntryForm';
import { TimeEntryList } from '../components/TimeEntryList';

export function TimeEntriesPage() {
  const { clientId, projectId, taskId } = useParams();

  if (!clientId || !projectId || !taskId) {
    return (
      <main>
        <h1>Time entries</h1>
        <p>Task not found.</p>
      </main>
    );
  }

  return (
    <main>
      <p>
        <Link to={paths.clients}>Clients</Link>
        {' / '}
        <Link to={clientProjectsPath(clientId)}>Projects</Link>
        {' / '}
        <Link to={projectTasksPath(clientId, projectId)}>Tasks</Link>
      </p>
      <h1>Time etnries</h1>
      <CreateTimeEntryForm taskId={taskId} />
      <TimeEntryList taskId={taskId} />
    </main>
  );
}
