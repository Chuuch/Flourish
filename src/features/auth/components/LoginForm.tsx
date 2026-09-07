import { useNavigate, useLocation } from 'react-router';
import { useLogin } from '../hooks/useLogin';
import { useForm } from 'react-hook-form';
import { loginInputSchema, type LoginInput } from '../schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { redirectFrom } from '../lib/redirect';
import { Button, TextField } from '@/components/ui';

export function LoginForm() {
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const from = redirectFrom(location.state);

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

      {login.isError && <p role="alert">{login.error.message}</p>}

      <Button type="submit" disabled={login.isPending}>
        Sign in
      </Button>
    </form>
  );
}
