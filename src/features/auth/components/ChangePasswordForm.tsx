import { useForm } from 'react-hook-form';
import { useChangePassword } from '../hooks/useChangePassword';
import { changePasswordInputSchema, type ChangePasswordInput } from '../schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, TextField } from '@/components/ui';
import { useI18n } from '@/features/i18n';

export function ChangePasswordForm() {
  const changePassword = useChangePassword();
  const { t } = useI18n();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordInputSchema),
    defaultValues: { current_password: '', password: '' },
  });

  if (changePassword.isSuccess) {
    return <p>{t('auth.passwordUpdated')}</p>;
  }

  return (
    <form
      onSubmit={(event) =>
        void handleSubmit((input) => {
          changePassword.mutate(input);
        })(event)
      }
      noValidate
    >
      <TextField
        label={t('auth.currentPassword')}
        type="password"
        autoComplete="current-password"
        error={errors.current_password?.message}
        {...register('current_password')}
      />

      <TextField
        label={t('auth.newPassword')}
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />

      {changePassword.isError ? <Alert>{changePassword.error.message}</Alert> : null}

      <Button type="submit" disabled={changePassword.isPending}>
        {t('auth.changePassword')}
      </Button>
    </form>
  );
}
