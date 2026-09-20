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

export function CreateClientUserForm({ clientId }: { clientId: string }) {
  const role = useAuthStore((state) => state.role);
  const createClientUser = useCreateClientUser(clientId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateClientUserInput>({
    resolver: zodResolver(createClientUserSchema),
    defaultValues: { email: '', password: '' },
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
        autoComplete="password"
        error={errors.password?.message}
        {...register('password')}
      />

      {createClientUser.isError ? <Alert>{createClientUser.error.message}</Alert> : null}

      <Button type="submit" disabled={createClientUser.isPending}>
        Add client user
      </Button>
    </form>
  );
}
