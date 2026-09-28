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
import { useI18n } from '@/features/i18n';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';

function ProjectManageForm({ clientId, project }: { clientId: string; project: Project }) {
  const updateProject = useUpdateProject(clientId);
  const deleteProject = useDeleteProject(clientId);
  const { t } = useI18n();

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
          label={t('projects.nameFor', { name: project.name })}
          autoComplete="off"
          error={errors.name?.message}
          {...register('name')}
        />

        <div>
          <label htmlFor={`notes-${project.id}`}>
            {t('projects.notesFor', { name: project.name })}
          </label>
          <textarea
            id={`notes-${project.id}`}
            className="block rounded border px-2 py-1"
            {...register('notes')}
          />
          {errors.notes ? <p role="alert">{errors.notes.message}</p> : null}
        </div>

        <Button type="submit" disabled={updateProject.isPending}>
          {t('projects.save', { name: project.name })}
        </Button>
      </form>
      <Button
        type="button"
        disabled={deleteProject.isPending}
        onClick={() => {
          deleteProject.mutate(project.id);
        }}
      >
        {t('projects.remove', { name: project.name })}
      </Button>
    </>
  );
}

export function ProjectList({ clientId }: { clientId: string }) {
  const role = useAuthStore((state) => state.role);
  const canManage = canManageProjects(role);
  const { data, isPending, isError, error, refetch } = useProjects(clientId);
  const { t } = useI18n();

  if (isPending) {
    return <ListSkeleton label={t('projects.loading')} />;
  }

  if (isError) {
    return (
      <Alert>
        <p>{t('projects.loadError', { message: error.message })}</p>
        <button type="button" onClick={() => void refetch()}>
          {t('common.retry')}
        </button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p>{t('projects.empty')}</p>;
  }

  return (
    <ul>
      {data.map((project) => (
        <li key={project.id}>
          <Link to={projectTasksPath(clientId, project.id)}>
            {project.notes ? `${project.name} - ${project.notes}` : project.name}
          </Link>{' '}
          <Link to={projectFilesPath(clientId, project.id)}>{t('common.files')}</Link>
          {canManage ? <ProjectManageForm clientId={clientId} project={project} /> : null}
        </li>
      ))}
    </ul>
  );
}
