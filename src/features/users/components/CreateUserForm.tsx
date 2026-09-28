import { useForm } from 'react-hook-form';
import { useCreateUser } from '../hooks/useCreateUser';
import { createUserSchema, type CreateUserInput } from '../schemas/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useI18n } from '@/features/i18n';
import { Alert, Button, TextField } from '@/components/ui';

export function CreateUserForm() {
  const createUser = useCreateUser();
  const { t } = useI18n();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (input: CreateUserInput) => {
    createUser.mutate(input, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <form onSubmit={(event) => void handleSubmit(onSubmit)(event)} noValidate>
      <label htmlFor="email">Email</label>
      <TextField
        label={t('auth.email')}
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      {createUser.isError ? <Alert>{createUser.error.message}</Alert> : null}

      <Button type="submit" disabled={createUser.isPending}>
        {t('users.add')}
      </Button>
    </form>
  );
}
