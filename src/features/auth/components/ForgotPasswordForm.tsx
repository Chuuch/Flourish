import { useForm } from 'react-hook-form';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { forgotPasswordInputSchema, type ForgotPasswordInput } from '../schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { paths } from '@/app/router/paths';
import { Alert, Button, TextField } from '@/components/ui';
import { useI18n } from '@/features/i18n';

export function ForgotPasswordForm() {
  const forgotPassword = useForgotPassword();
  const { t } = useI18n();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordInputSchema),
    defaultValues: { email: '' },
  });

  if (forgotPassword.isSuccess) {
    return (
      <div>
        <p>{t('auth.resetSent')}</p>
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
          forgotPassword.mutate(input);
        })(event)
      }
      noValidate
    >
      <TextField
        label={t('auth.email')}
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      {forgotPassword.isError ? <Alert>{forgotPassword.error.message}</Alert> : null}

      <div className="form-actions">
        <Button type="submit" disabled={forgotPassword.isPending}>
          {t('auth.sendResetLink')}
        </Button>
      </div>
    </form>
  );
}
