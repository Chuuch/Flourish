import { Alert } from '@/components/ui';
import { useClientUsers } from '../hooks/useClientUsers';

export function ClientUserList({ clientId }: { clientId: string }) {
  const { data, isPending, isError, error, refetch } = useClientUsers(clientId);

  if (isPending) {
    return <p role="status">Loading client users...</p>;
  }

  if (isError) {
    return (
      <Alert>
        <p>Could not load client users: {error.message}</p>
        <button type="button" onClick={() => void refetch()}>
          Retry
        </button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p>No client users yet.</p>;
  }

  return (
    <ul>
      {data.map((clientUser) => (
        <li key={clientUser.user_id}>{clientUser.email}</li>
      ))}
    </ul>
  );
}
