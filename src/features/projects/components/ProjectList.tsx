import { Alert, Button, TextField } from '@/components/ui';
import { useProjects } from '../hooks/useProjects';
import { projectTasksPath, projectFilesPath } from '@/app/router/paths';
import { Link } from 'react-router';
import {
  canManageProjects,
  updateProjectSchema,
  type Project,
  type UpdateProjectInput,
} from '../schemas/project.schema';
import { useUpdateProject } from '../hooks/useUpdateProject';
import { useDeleteProject } from '../hooks/useDeleteProject';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/features/auth';

function ProjectManageForm({ clientId, project }: { clientId: string; project: Project }) {
  const updateProject = useUpdateProject(clientId);
  const deleteProject = useDeleteProject(clientId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProjectInput>({
    resolver: zodResolver(updateProjectSchema),
    values: { name: project.name, notes: project.notes },
  });

  return (
    <>
      {updateProject.isError ? <Alert>{updateProject.error.message}</Alert> : null}
      {deleteProject.isError ? <Alert>{deleteProject.error.message}</Alert> : null}
      <form
        onSubmit={(event) =>
          void handleSubmit((input) => {
            updateProject.mutate({ projectId: project.id, input });
          })(event)
        }
        noValidate
      >
        <TextField
          label={`Name for ${project.name}`}
          autoComplete="off"
          error={errors.name?.message}
          {...register('name')}
        />

        <div>
          <label htmlFor={`notes-${project.id}`}>Notes for {project.name}</label>
          <textarea
            id={`notes-${project.id}`}
            className="block rounded border px-2 py-1"
            {...register('notes')}
          />
          {errors.notes ? <p role="alert">{errors.notes.message}</p> : null}
        </div>

        <Button type="submit" disabled={updateProject.isPending}>
          {`Save ${project.name}`}
        </Button>
      </form>
      <Button
        type="button"
        disabled={deleteProject.isPending}
        onClick={() => {
          deleteProject.mutate(project.id);
        }}
      >
        {`Remove ${project.name}`}
      </Button>
    </>
  );
}

export function ProjectList({ clientId }: { clientId: string }) {
  const role = useAuthStore((state) => state.role);
  const canManage = canManageProjects(role);
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
          <Link to={projectTasksPath(clientId, project.id)}>
            {project.notes ? `${project.name} - ${project.notes}` : project.name}
          </Link>{' '}
          <Link to={projectFilesPath(clientId, project.id)}>Files</Link>
          {canManage ? <ProjectManageForm clientId={clientId} project={project} /> : null}
        </li>
      ))}
    </ul>
  );
}
