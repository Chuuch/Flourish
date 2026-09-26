import { useForm } from 'react-hook-form';
import { useChangePassword } from '../hooks/useChangePassword';
import { changePasswordInputSchema, type ChangePasswordInput } from '../schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, TextField } from '@/components/ui';

export function ChangePasswordForm() {
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordInputSchema),
    defaultValues: { current_password: '', password: '' },
  });

  if (changePassword.isSuccess) {
    return <p>Password updated.</p>;
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
        label="Current password"
        type="password"
        autoComplete="current-password"
        error={errors.current_password?.message}
        {...register('current_password')}
      />

      <TextField
        label="New password"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />

      {changePassword.isError ? <Alert>{changePassword.error.message}</Alert> : null}

      <Button type="submit" disabled={changePassword.isPending}>
        Change password
      </Button>
    </form>
  );
}
