import { useAuthStore } from '@/features/auth';
import { useForm } from 'react-hook-form';
import {
  createProjectSchema,
  type CreateProjectInput,
  canManageProjects,
} from '../schemas/project.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateProject } from '../hooks/useCreateProject';
import { Alert, Button, FormSection, TextArea, TextField } from '@/components/ui';
import { useI18n } from '@/features/i18n';

type CreateProjectFormProps = {
  clientId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function CreateProjectForm({ clientId, onSuccess, onCancel }: CreateProjectFormProps) {
  const role = useAuthStore((state) => state.role);
  const createProject = useCreateProject(clientId);
  const { t } = useI18n();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { name: '', notes: '' },
  });

  if (!canManageProjects(role)) {
    return null;
  }

  return (
    <form
      onSubmit={(event) =>
        void handleSubmit((input) => {
          createProject.mutate(input, {
            onSuccess: () => {
              reset();
              onSuccess?.();
            },
          });
        })(event)
      }
      noValidate
    >
      <FormSection title={t('projects.add')}>
        <TextField
          label={t('clients.name')}
          autoComplete="off"
          error={errors.name?.message}
          {...register('name')}
        />
        <TextArea label={t('clients.notes')} error={errors.notes?.message} {...register('notes')} />

        {createProject.isError ? <Alert>{createProject.error.message}</Alert> : null}

        <div className="form-actions">
          {onCancel ? (
            <Button type="button" variant="ghost" onClick={onCancel}>
              {t('common.cancel')}
            </Button>
          ) : null}
          <Button type="submit" disabled={createProject.isPending}>
            {t('projects.add')}
          </Button>
        </div>
      </FormSection>
    </form>
  );
}
