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
import { Alert, Button, FormSection, TextArea, TextField } from '@/components/ui';

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
    <div className="flex flex-col gap-3">
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
        <FormSection>
          <TextField
            label={t('clients.name')}
            autoComplete="off"
            error={errors.name?.message}
            {...register('name')}
          />
          <TextArea
            label={t('clients.notes')}
            error={errors.notes?.message}
            {...register('notes')}
          />
        </FormSection>

        <div className="form-actions">
          <Button type="submit" disabled={updateProject.isPending}>
            {t('common.save')}
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={deleteProject.isPending}
            aria-label={t('projects.remove', { name: project.name })}
            onClick={() => {
              deleteProject.mutate(project.id);
            }}
          >
            {t('common.delete')}
          </Button>
        </div>
      </form>
    </div>
  );
}
