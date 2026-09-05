import { useUsers } from '../hooks/useUsers';

export function UserList() {
  const { data, isPending, isError, error, refetch } = useUsers();

  if (isPending) {
    return <p role="status">Loading users...</p>;
  }

  if (isError) {
    return (
      <div role="alert">
        <p>Could not load users: {error.message}</p>
        <button type="button" onClick={() => void refetch()}>
          Retry
        </button>
      </div>
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
