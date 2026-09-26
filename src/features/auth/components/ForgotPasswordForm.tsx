import { useForm } from 'react-hook-form';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { forgotPasswordInputSchema, type ForgotPasswordInput } from '../schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { paths } from '@/app/router/paths';
import { Alert, Button, TextField } from '@/components/ui';

export function ForgotPasswordForm() {
  const forgotPassword = useForgotPassword();

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
        <p>If that email is registered, we sent a reset link.</p>
        <p>
          <Link to={paths.login}>Staff sign in</Link>
        </p>
        <p>
          <Link to={paths.portalLogin}>Client sign in</Link>
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
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      {forgotPassword.isError ? <Alert>{forgotPassword.error.message}</Alert> : null}

      <Button type="submit" disabled={forgotPassword.isPending}>
        Send reset link
      </Button>
    </form>
  );
}
