import { useAuthStore } from '@/features/auth';
import { useProjects } from '@/features/projects';
import { useConvertTicket } from '../hooks/useConvertTicket';
import { useState } from 'react';
import { canManageTasks } from '@/features/tasks/schemas/task.schema';
import { Alert, Button } from '@/components/ui';
import { Link } from 'react-router';
import { projectTasksPath } from '@/app/router/paths';

export function ConvertTicketForm({
  clientId,
  ticketId,
  ticketTitle,
}: {
  clientId: string;
  ticketId: string;
  ticketTitle: string;
}) {
  const role = useAuthStore((state) => state.role);
  const projects = useProjects(clientId);
  const convertTicket = useConvertTicket(clientId);
  const [projectId, setProjectId] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!canManageTasks(role)) {
    return null;
  }

  if (projects.isPending) {
    return <p role="status">Loading projects...</p>;
  }

  if (projects.isError) {
    return (
      <Alert>
        <p>Could not load projects: {projects.error.message}</p>
      </Alert>
    );
  }

  if (projects.data.length === 0) {
    return <p>No projects yet.</p>;
  }

  const created = convertTicket.data;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!projectId) {
          setValidationError('Project is required');
          return;
        }
        setValidationError(null);
        convertTicket.mutate({ ticketId, projectId });
      }}
      noValidate
    >
      <div>
        <label htmlFor={`convert-project-${ticketId}`}>Convert {ticketTitle} on</label>
        <select
          id={`convert-project-${ticketId}`}
          className="block rounded px-2 py-1"
          value={projectId}
          onChange={(event) => {
            setProjectId(event.currentTarget.value);
          }}
        >
          <option value="">Select a project</option>
          {projects.data.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {validationError ? <p role="alert">{validationError}</p> : null}
      {convertTicket.isError ? <Alert>{convertTicket.error.message}</Alert> : null}

      <Button type="submit" disabled={convertTicket.isPending}>
        Convert to task
      </Button>

      {created ? (
        <p>
          <Link to={projectTasksPath(clientId, created.project_id)}>Opened as {created.title}</Link>
        </p>
      ) : null}
    </form>
  );
}
