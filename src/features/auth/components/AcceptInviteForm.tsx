import { Link, useSearchParams } from 'react-router';
import { useAcceptInvite } from '../hooks/useAcceptInvite';
import { useForm } from 'react-hook-form';
import { acceptInviteFormSchema, type AcceptInviteFormInput } from '../schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, TextField } from '@/components/ui';
import { paths } from '@/app/router/paths';
import { useI18n } from '@/features/i18n';

export function AcceptInviteForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const acceptInvite = useAcceptInvite();
  const { t } = useI18n();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptInviteFormInput>({
    resolver: zodResolver(acceptInviteFormSchema),
    defaultValues: { password: '' },
  });

  if (!token) {
    return <Alert>{t('auth.inviteMissingToken')}</Alert>;
  }

  if (acceptInvite.isSuccess) {
    return (
      <div>
        <p>{t('auth.inviteSuccess')}</p>
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
          acceptInvite.mutate({ token, password: input.password });
        })(event)
      }
      noValidate
    >
      <TextField
        label={t('auth.password')}
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />

      {acceptInvite.isError ? <Alert>{acceptInvite.error.message}</Alert> : null}

      <div className="form-actions">
        <Button type="submit" disabled={acceptInvite.isPending}>
          {t('auth.setPasswordAction')}
        </Button>
      </div>
    </form>
  );
}
