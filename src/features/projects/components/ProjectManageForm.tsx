import { useI18n } from '@/features/i18n';
import { useDeleteProject } from '../hooks/useDeleteProject';
import { useUpdateProject } from '../hooks/useUpdateProject';
import { useForm } from 'react-hook-form';
import {
  updateProjectSchema,
  type Project,
  type UpdateProjectInput,
} from '../schemas/project.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, TextField } from '@/components/ui';

export function ProjectManageForm({ clientId, project }: { clientId: string; project: Project }) {
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
