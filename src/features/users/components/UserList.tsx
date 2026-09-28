import { Alert } from '@/components/ui';
import { useUsers } from '../hooks/useUsers';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';

export function UserList() {
  const { data, isPending, isError, error, refetch } = useUsers();

  if (isPending) {
    return <ListSkeleton label="Loading users..." />;
  }

  if (isError) {
    return (
      <Alert>
        <p>Could not load users: {error.message}</p>
        <button type="button" onClick={() => void refetch()}>
          Retry
        </button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p>No users yet.</p>;
  }

  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.email}</li>
      ))}
    </ul>
  );
}
