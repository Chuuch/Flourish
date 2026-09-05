import { useForm } from 'react-hook-form';
import { useCreateUser } from '../hooks/useCreateUser';
import { createUserSchema, type CreateUserInput } from '../schemas/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';

export function CreateUserForm() {
  const createUser = useCreateUser();

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
      <input
        id="email"
        type="email"
        autoComplete="email"
        aria-invalid={errors.email ? true : undefined}
        aria-described-by={errors.email ? 'email-error' : undefined}
        {...register('email')}
      />
      {errors.email && (
        <p id="email-error" role="alert">
          {errors.email.message}
        </p>
      )}

      {createUser.isError && <p role="alert">{createUser.error.message}</p>}

      <button type="submit" disabled={createUser.isPending}>
        Create user
      </button>
    </form>
  );
}
