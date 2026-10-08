import { useAuthStore } from '@/features/auth';
import { useCreateClientUser } from '../hooks/useCreateClientUser';
import { useForm } from 'react-hook-form';
import {
  canManageClientUsers,
  createClientUserSchema,
  type CreateClientUserInput,
} from '../schemas/client-user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, TextField } from '@/components/ui';
import { useI18n } from '@/features/i18n';

type CreateClientUserFormProps = {
  clientId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function CreateClientUserForm({ clientId, onSuccess, onCancel }: CreateClientUserFormProps) {
  const role = useAuthStore((state) => state.role);
  const createClientUser = useCreateClientUser(clientId);
  const { t } = useI18n();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateClientUserInput>({
    resolver: zodResolver(createClientUserSchema),
    defaultValues: { email: '' },
  });

  if (!canManageClientUsers(role)) {
    return null;
  }

  return (
    <form
      onSubmit={(event) =>
        void handleSubmit((input) => {
          createClientUser.mutate(input, {
            onSuccess: () => {
              reset();
              onSuccess?.();
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

      {createClientUser.isError ? <Alert>{createClientUser.error.message}</Alert> : null}

      <div className="form-actions">
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        ) : null}
        <Button type="submit" disabled={createClientUser.isPending}>
          {t('clientUsers.invite')}
        </Button>
      </div>
    </form>
  );
}
