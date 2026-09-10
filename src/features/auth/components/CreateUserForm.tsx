import { Alert, Button, TextField } from '@/components/ui';
import { useCreateUser } from '@/features/users/hooks/useCreateUser';
import { createUserSchema, type CreateUserInput } from '@/features/users/schemas/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export function CreateUserForm() {
  const createUser = useCreateUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { email: ' ' },
  });

  return (
    <form
      onSubmit={(event) =>
        void handleSubmit((input) => {
          createUser.mutate(input, {
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

      {createUser.isError ? <Alert>{createUser.error.message}</Alert> : null}
      <Button type="submit" disabled={createUser.isPending}>
        Add user
      </Button>
    </form>
  );
}
