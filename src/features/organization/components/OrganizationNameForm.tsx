import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, TextField } from '@/components/ui';
import { useAuthStore } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { canManageMembers } from '@/features/members/schemas/member.schema';
import {
  updateOrganizationInputSchema,
  type UpdateOrganizationInput,
} from '@/features/auth/schemas/auth.schema';
import { useUpdateOrganization } from '../hooks/useUpdateOrganization';

export function OrganizationNameForm() {
  const role = useAuthStore((state) => state.role);
  const name = useAuthStore((state) => state.organization?.name ?? '');
  const updateOrganization = useUpdateOrganization();
  const { t } = useI18n();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateOrganizationInput>({
    resolver: zodResolver(updateOrganizationInputSchema),
    values: { name },
  });

  if (!canManageMembers(role)) {
    return null;
  }

  return (
    <form
      onSubmit={(event) =>
        void handleSubmit((input) => {
          updateOrganization.mutate(input);
        })(event)
      }
      noValidate
    >
      <TextField
        label={t('auth.organizationName')}
        autoComplete="organization"
        error={errors.name?.message}
        {...register('name')}
      />

      {updateOrganization.isError ? <Alert>{updateOrganization.error.message}</Alert> : null}

      <Button type="submit" disabled={updateOrganization.isPending}>
        {t('auth.saveOrganization')}
      </Button>
    </form>
  );
}
