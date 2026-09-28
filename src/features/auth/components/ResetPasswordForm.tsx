import { Link, useSearchParams } from 'react-router';
import { useResetPassword } from '../hooks/useResetPassword';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordFormSchema, type ResetPasswordFormInput } from '../schemas/auth.schema';
import { Alert, Button, TextField } from '@/components/ui';
import { paths } from '@/app/router/paths';
import { useI18n } from '@/features/i18n';

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const resetPassword = useResetPassword();
  const { t } = useI18n();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormInput>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: { password: '' },
  });

  if (!token) {
    return <Alert>{t('auth.resetMissingToken')}</Alert>;
  }

  if (resetPassword.isSuccess) {
    return (
      <div>
        <p>{t('auth.resetSuccess')}</p>
        <p>
          <Link to={paths.login}>{t('auth.staffSignIn')}</Link>
        </p>
        <p>
          <Link to={paths.portalLogin}>{t('auth.clientSignIn')}</Link>
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) =>
        void handleSubmit((input) => {
          resetPassword.mutate({ token, password: input.password });
        })(event)
      }
      noValidate
    >
      <TextField
        label={t('auth.password')}
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />

      {resetPassword.isError ? <Alert>{resetPassword.error.message}</Alert> : null}

      <Button type="submit" disabled={resetPassword.isPending}>
        {t('auth.setPasswordAction')}
      </Button>
    </form>
  );
}
