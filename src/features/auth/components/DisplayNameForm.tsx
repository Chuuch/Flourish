import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, TextField } from '@/components/ui';
import { useI18n } from '@/features/i18n';
import { useAuthStore } from '../store/auth.store';
import { useUpdateDisplayName } from '../hooks/useUpdateDisplayName';
import { updateDisplayNameInputSchema, type UpdateDisplayNameInput } from '../schemas/auth.schema';

export function DisplayNameForm() {
  const displayName = useAuthStore((state) => state.user?.display_name ?? '');
  const updateDisplayName = useUpdateDisplayName();
  const { t } = useI18n();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateDisplayNameInput>({
    resolver: zodResolver(updateDisplayNameInputSchema),
    values: { display_name: displayName },
  });

  return (
    <form
      onSubmit={(event) =>
        void handleSubmit((input) => {
          updateDisplayName.mutate(input);
        })(event)
      }
      noValidate
    >
      <TextField
        label={t('auth.displayName')}
        autoComplete="nickname"
        error={errors.display_name?.message}
        {...register('display_name')}
      />

      {updateDisplayName.isError ? <Alert>{updateDisplayName.error.message}</Alert> : null}

      <Button type="submit" disabled={updateDisplayName.isPending}>
        {t('auth.saveDisplayName')}
      </Button>
    </form>
  );
}
