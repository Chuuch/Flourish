import { useNavigate, useLocation } from 'react-router';
import { useLogin } from '../hooks/useLogin';
import { useForm } from 'react-hook-form';
import { loginInputSchema, type LoginInput } from '../schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { redirectFrom } from '../lib/redirect';

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
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        autoComplete="email"
        aria-invalid={errors.email ? true : undefined}
        aria-describedby={errors.email ? 'email-error' : undefined}
        {...register('email')}
      />
      {errors.email && (
        <p id="email-error" role="alert">
          {errors.email.message}
        </p>
      )}

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        autoComplete="current-password"
        aria-invalid={errors.password ? true : undefined}
        aria-describedby={errors.password ? 'password-error' : undefined}
        {...register('password')}
      />
      {errors.password && (
        <p id="password-error" role="alert">
          {errors.password.message}
        </p>
      )}

      {login.isError && <p role="alert">{login.error.message}</p>}

      <button type="submit" disabled={login.isPending}>
        Sign in
      </button>
    </form>
  );
}
