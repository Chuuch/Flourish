import { useAuthStore } from '@/features/auth';
import { useCreateClient } from '../hooks/useCreateClient';
import { useForm } from 'react-hook-form';
import {
  createClientSchema,
  type CreateClientInput,
  canManageClients,
} from '../schemas/client.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, TextField } from '@/components/ui';

export function CreateClientForm() {
  const role = useAuthStore((state) => state.role);
  const createClient = useCreateClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateClientInput>({
    resolver: zodResolver(createClientSchema),
    defaultValues: { name: '', notes: '' },
  });

  if (!canManageClients(role)) {
    return null;
  }

  return (
    <form
      onSubmit={(event) =>
        void handleSubmit((input) => {
          createClient.mutate(input, {
            onSuccess: () => {
              reset();
            },
          });
        })(event)
      }
      noValidate
    >
      <TextField
        label="Name"
        autoComplete="organization"
        error={errors.name?.message}
        {...register('name')}
      />

      <div>
        <label htmlFor="notes">Notes</label>
        <textarea id="notes" className="block rounded border px-2 py-1" {...register('notes')} />
        {errors.notes ? <p role="alert">{errors.notes.message}</p> : null}
      </div>

      {createClient.isError ? <Alert>{createClient.error.message}</Alert> : null}

      <Button type="submit" disabled={createClient.isPending}>
        Add client
      </Button>
    </form>
  );
}
