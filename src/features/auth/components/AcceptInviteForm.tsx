import { Link, useSearchParams } from 'react-router';
import { useAcceptInvite } from '../hooks/useAcceptInvite';
import { useForm } from 'react-hook-form';
import { acceptInviteFormSchema, type AcceptInviteFormInput } from '../schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, TextField } from '@/components/ui';
import { paths } from '@/app/router/paths';

export function AcceptInviteForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const acceptInvite = useAcceptInvite();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptInviteFormInput>({
    resolver: zodResolver(acceptInviteFormSchema),
    defaultValues: { password: '' },
  });

  if (!token) {
    return <Alert>This invite link is missing a token.</Alert>;
  }

  if (acceptInvite.isSuccess) {
    return (
      <div>
        <p>Invite accepted. Sign in with the password you just set.</p>
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
          acceptInvite.mutate({ token, password: input.password });
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

      {acceptInvite.isError ? <Alert>{acceptInvite.error.message}</Alert> : null}

      <Button type="submit" disabled={acceptInvite.isPending}>
        Set password
      </Button>
    </form>
  );
}
