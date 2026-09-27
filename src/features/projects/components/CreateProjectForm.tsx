import { useAuthStore } from '@/features/auth';
import { useForm } from 'react-hook-form';
import {
  createProjectSchema,
  type CreateProjectInput,
  canManageProjects,
} from '../schemas/project.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateProject } from '../hooks/useCreateProject';
import { Alert, Button, TextField } from '@/components/ui';
import { useI18n } from '@/features/i18n';

export function CreateProjectForm({ clientId }: { clientId: string }) {
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
            },
          });
        })(event)
      }
      noValidate
    >
      <TextField
        label={t('clients.name')}
        autoComplete="off"
        error={errors.name?.message}
        {...register('name')}
      />

      <div>
        <label htmlFor="notes">{t('clients.notes')}</label>
        <textarea id="notes" className="block rounded border px-2 py-1" {...register('notes')} />
        {errors.notes ? <p role="alert">{errors.notes.message}</p> : null}

        {createProject.isError ? <Alert>{createProject.error.message}</Alert> : null}

        <Button type="submit" disabled={createProject.isPending}>
          {t('projects.add')}
        </Button>
      </div>
    </form>
  );
}
