import { Link, useNavigate } from 'react-router';
import { useRegister } from '../hooks/useRegister';
import { useForm } from 'react-hook-form';
import { registerInputSchema, type RegisterInput } from '../schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { paths } from '@/app/router/paths';
import { Alert, Button, TextField } from '@/components/ui';

export function RegisterForm() {
  const registerAccount = useRegister();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerInputSchema),
    defaultValues: { email: '', password: '', organization_name: '' },
  });

  return (
    <form
      onSubmit={(event) =>
        void handleSubmit((input) => {
          registerAccount.mutate(input, {
            onSuccess: () => {
              void navigate(paths.home, { replace: true });
            },
          });
        })(event)
      }
      noValidate
    >
      <TextField
        label="Organization name"
        autoComplete="organization"
        error={errors.organization_name?.message}
        {...register('organization_name')}
      />

      <TextField
        label="email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <TextField
        label="password"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />

      {registerAccount.isError ? <Alert>{registerAccount.error.message}</Alert> : null}

      <Button type="submit" disabled={registerAccount.isPending}>
        Create account
      </Button>

      <p>
        Already have an account? <Link to={paths.login}>Sign in</Link>
      </p>
    </form>
  );
}
