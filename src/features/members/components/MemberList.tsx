import { Alert, Button } from '@/components/ui';
import { useMembers } from '../hooks/useMembers';
import { useAuthStore } from '@/features/auth';
import { assignableRoleSchema, canManageMembers, type MemberRole } from '../schemas/member.schema';
import { useUpdateMember } from '../hooks/useUpdateMember';
import { useDeleteMember } from '../hooks/useDeleteMember';

export function MemberList() {
  const role = useAuthStore((state) => state.role);
  const canManage = canManageMembers(role);
  const { data, isPending, isError, error, refetch } = useMembers();
  const updateMember = useUpdateMember();
  const deleteMember = useDeleteMember();

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
    <>
      {updateMember.isError ? <Alert>{updateMember.error.message}</Alert> : null}
      {deleteMember.isError ? <Alert>{deleteMember.error.message}</Alert> : null}
      <ul>
        {data.map((member) => (
          <li key={member.user_id}>
            <p>
              {member.email} - {member.role}
            </p>
            {canManage && member.role !== 'owner' ? (
              <label>
                Role for {member.email}
                <select
                  value={member.role}
                  disabled={updateMember.isPending}
                  onChange={(event) => {
                    const parsed = assignableRoleSchema.safeParse(event.currentTarget.value);

                    if (!parsed.success) {
                      return;
                    }

                    const nextRole: MemberRole = parsed.data;
                    updateMember.mutate({
                      userId: member.user_id,
                      input: { role: nextRole },
                    });
                  }}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            ) : null}
            {canManage ? (
              <Button
                type="button"
                disabled={deleteMember.isPending}
                onClick={() => {
                  deleteMember.mutate(member.user_id);
                }}
              >
                {`Remove ${member.email}`}
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </>
  );
}
