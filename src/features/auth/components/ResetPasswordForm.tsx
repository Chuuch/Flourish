import { Link, useSearchParams } from 'react-router';
import { useResetPassword } from '../hooks/useResetPassword';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordFormSchema, type ResetPasswordFormInput } from '../schemas/auth.schema';
import { Alert, Button, TextField } from '@/components/ui';
import { paths } from '@/app/router/paths';

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const resetPassword = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormInput>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: { password: '' },
  });

  if (!token) {
    return <Alert>This reset link is missing a token.</Alert>;
  }

  if (resetPassword.isSuccess) {
    return (
      <div>
        <p>Password updated. Sign in with the password you just set.</p>
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
          resetPassword.mutate({ token, password: input.password });
        })(event)
      }
      noValidate
    >
      <TextField
        label="Password"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />

      {resetPassword.isError ? <Alert>{resetPassword.error.message}</Alert> : null}

      <Button type="submit" disabled={resetPassword.isPending}>
        Set password
      </Button>
    </form>
  );
}
