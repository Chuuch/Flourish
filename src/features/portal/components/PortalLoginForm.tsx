import { useNavigate } from 'react-router';
import { usePortalLogin } from '../hooks/usePortalLogin';
import { useForm } from 'react-hook-form';
import { loginInputSchema, type LoginInput } from '@/features/auth/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { paths } from '@/app/router/paths';
import { Alert, Button, TextField } from '@/components/ui';

export function PortalLoginForm() {
  const login = usePortalLogin();
  const navigate = useNavigate();

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
              void navigate(paths.portal, { replace: true });
            },
          });
        })(event)
      }
      noValidate
    >
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <TextField
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />

      {login.isError ? <Alert>{login.error.message}</Alert> : null}

      <Button type="submit" disabled={login.isPending}>
        Sign in
      </Button>
    </form>
  );
}
