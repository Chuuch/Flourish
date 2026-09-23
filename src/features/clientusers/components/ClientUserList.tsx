import { Alert, Button } from '@/components/ui';
import { useClientUsers } from '../hooks/useClientUsers';
import { useAuthStore } from '@/features/auth';
import { canManageClientUsers } from '../schemas/client-user.schema';
import { useDeleteClientUser } from '../hooks/useDeleteClientUser';

export function ClientUserList({ clientId }: { clientId: string }) {
  const role = useAuthStore((state) => state.role);
  const canManage = canManageClientUsers(role);
  const { data, isPending, isError, error, refetch } = useClientUsers(clientId);
  const deleteClientUser = useDeleteClientUser(clientId);

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
    <>
      {deleteClientUser.isError ? <Alert>{deleteClientUser.error.message}</Alert> : null}
      <ul>
        {data.map((clientUser) => (
          <li key={clientUser.user_id}>
            {clientUser.email}
            {canManage ? (
              <Button
                type="button"
                disabled={deleteClientUser.isPending}
                onClick={() => {
                  deleteClientUser.mutate(clientUser.user_id);
                }}
              >
                {`Remove ${clientUser.email}`}
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </>
  );
}
