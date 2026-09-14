import { Alert } from '@/components/ui';
import { useProjects } from '../hooks/useProjects';

export function ProjectList({ clientId }: { clientId: string }) {
  const { data, isPending, isError, error, refetch } = useProjects(clientId);

  if (isPending) {
    return <p role="status">Loading projects...</p>;
  }

  if (isError) {
    return (
      <Alert>
        <p>Could not load projects: {error.message}</p>
        <button type="button" onClick={() => void refetch()}>
          Retry
        </button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p>No projects yet.</p>;
  }

  return (
    <ul>
      {data.map((project) => (
        <li key={project.id}>
          {project.notes ? `${project.name} - ${project.notes}` : project.name}
        </li>
      ))}
    </ul>
  );
}
