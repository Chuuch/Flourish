import { Alert } from '@/components/ui';
import { useMembers } from '../hooks/useMembers';

export function MemberList() {
  const { data, isPending, isError, error, refetch } = useMembers();

  if (isPending) {
    return <p role="status">Loading members...</p>;
  }

  if (isError) {
    return (
      <Alert>
        <p>Could not load members: {error.message}</p>
        <button type="button" onClick={() => void refetch()}>
          Retry
        </button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p>No members yet.</p>;
  }

  return (
    <ul>
      {data.map((member) => (
        <li key={member.user_id}>
          {member.email} - {member.role}
        </li>
      ))}
    </ul>
  );
}
