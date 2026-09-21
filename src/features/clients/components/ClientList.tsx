import { Alert } from '@/components/ui';
import { useClients } from '../hooks/useClients';
import { Link } from 'react-router';
import { clientProjectsPath, clientTicketsPath, clientUsersPath } from '@/app/router/paths';

export function ClientList() {
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
        </li>
      ))}
    </ul>
  );
}
