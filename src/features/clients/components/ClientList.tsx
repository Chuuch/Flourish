import { Alert, Button, TextField } from '@/components/ui';
import { useClients } from '../hooks/useClients';
import { Link } from 'react-router';
import { clientProjectsPath, clientTicketsPath, clientUsersPath } from '@/app/router/paths';
import {
  canManageClients,
  updateClientSchema,
  type Client,
  type UpdateClientInput,
} from '../schemas/client.schema';
import { useUpdateClient } from '../hooks/useUpdateClient';
import { useDeleteClient } from '../hooks/useDeleteClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/features/auth';

function ClientManageForm({ client }: { client: Client }) {
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateClientInput>({
    resolver: zodResolver(updateClientSchema),
    values: { name: client.name, notes: client.notes },
  });

  return (
    <>
      {updateClient.isError ? <Alert>{updateClient.error.message}</Alert> : null}
      {deleteClient.isError ? <Alert>{deleteClient.error.message}</Alert> : null}
      <form
        onSubmit={(event) =>
          void handleSubmit((input) => {
            updateClient.mutate({ clientId: client.id, input });
          })(event)
        }
        noValidate
      >
        <TextField
          label={`Name for ${client.name}`}
          autoComplete="organization"
          error={errors.name?.message}
          {...register('name')}
        />

        <div>
          <label htmlFor={`notes-${client.id}`}>Notes for {client.name}</label>
          <textarea
            id={`notes-${client.id}`}
            className="block rounded px-2 py-1"
            {...register('notes')}
          />
          {errors.notes ? <p role="alert">{errors.notes.message}</p> : null}
        </div>

        <Button type="submit" disabled={updateClient.isPending}>
          {`Save ${client.name}`}
        </Button>
      </form>
      <Button
        type="button"
        disabled={deleteClient.isPending}
        onClick={() => {
          deleteClient.mutate(client.id);
        }}
      >
        {`Remove ${client.name}`}
      </Button>
    </>
  );
}

export function ClientList() {
  const role = useAuthStore((state) => state.role);
  const canManage = canManageClients(role);
  const { data, isPending, isError, error, refetch } = useClients();

  if (isPending) {
    return <p role="status">Loading clients...</p>;
  }

  if (isError) {
    return (
      <Alert>
        <p>Could not load clients: {error.message}</p>
        <button type="button" onClick={() => void refetch()}>
          Retry
        </button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p>No clients yet.</p>;
  }

  return (
    <ul>
      {data.map((client) => (
        <li key={client.id}>
          <Link to={clientProjectsPath(client.id)}>
            {client.notes ? `${client.name} - ${client.notes}` : client.name}
          </Link>
          <Link to={clientUsersPath(client.id)}>Users</Link>
          <Link to={clientTicketsPath(client.id)}>Tickets</Link>
          {canManage ? <ClientManageForm client={client} /> : null}
        </li>
      ))}
    </ul>
  );
}
