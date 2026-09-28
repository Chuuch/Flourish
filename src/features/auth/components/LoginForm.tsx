import { useNavigate, useLocation } from 'react-router';
import { useLogin } from '../hooks/useLogin';
import { useForm } from 'react-hook-form';
import { loginInputSchema, type LoginInput } from '../schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { redirectFrom } from '../lib/redirect';
import { Alert, Button, TextField } from '@/components/ui';
import { useI18n } from '@/features/i18n';

export function LoginForm() {
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const from = redirectFrom(location.state);
  const { t } = useI18n();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <form
      onSubmit={(event) =>
        void handleSubmit((input) => {
          login.mutate(input, {
            onSuccess: () => {
              void navigate(from, { replace: true });
            },
          });
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

      <TextField
        label={t('auth.password')}
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />

      {login.isError ? <Alert>{login.error.message}</Alert> : null}

      <Button type="submit" disabled={login.isPending}>
        {t('auth.signIn')}
      </Button>
    </form>
  );
}
