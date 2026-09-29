import { Alert, Button } from '@/components/ui';
import { useMembers } from '../hooks/useMembers';
import { useAuthStore } from '@/features/auth';
import {
  assignableRoleSchema,
  canManageMembers,
  memberLabel,
  type MemberRole,
} from '../schemas/member.schema';
import { useUpdateMember } from '../hooks/useUpdateMember';
import { useDeleteMember } from '../hooks/useDeleteMember';
import { useI18n } from '@/features/i18n';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';

export function MemberList() {
  const role = useAuthStore((state) => state.role);
  const canManage = canManageMembers(role);
  const { data, isPending, isError, error, refetch } = useMembers();
  const updateMember = useUpdateMember();
  const deleteMember = useDeleteMember();
  const { t } = useI18n();

  if (isPending) {
    return <ListSkeleton label={t('members.loading')} />;
  }

  if (isError) {
    return (
      <Alert>
        <p>{t('members.loadError', { message: error.message })}</p>
        <button type="button" onClick={() => void refetch()}>
          {t('common.retry')}
        </button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p>{t('members.empty')}</p>;
  }

  return (
    <>
      {updateMember.isError ? <Alert>{updateMember.error.message}</Alert> : null}
      {deleteMember.isError ? <Alert>{deleteMember.error.message}</Alert> : null}
      <ul>
        {data.map((member) => (
          <li key={member.user_id}>
            <p>{t('members.summary', { email: memberLabel(member), role: member.role })}</p>
            {canManage && member.role !== 'owner' ? (
              <label>
                {t('members.roleFor', { email: memberLabel(member) })}
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
                  <option value="member">{t('role.member')}</option>
                  <option value="admin">{t('role.admin')}</option>
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
                {t('members.remove', { email: memberLabel(member) })}
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </>
  );
}
