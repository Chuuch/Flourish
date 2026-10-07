import { Alert, Button, SelectField } from '@/components/ui';
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
import { RoleBadge } from './RoleBadge';

export function MemberList({ query = '' }: { query?: string }) {
  const role = useAuthStore((state) => state.role);
  const canManage = canManageMembers(role);
  const { data, isPending, isError, error, refetch, isFetching } = useMembers(query);
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
        <Button type="button" variant="ghost" size="sm" onClick={() => void refetch()}>
          {t('common.retry')}
        </Button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return (
      <p className="text-muted m-0 text-sm">
        {query ? t('members.noMatches') : t('members.empty')}
      </p>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="m-0 text-sm font-semibold tracking-tight">{t('members.teamHeading')}</h2>
      {updateMember.isError ? <Alert>{updateMember.error.message}</Alert> : null}
      {deleteMember.isError ? <Alert>{deleteMember.error.message}</Alert> : null}
      <ul className={isFetching ? 'stack-list opacity-70' : 'stack-list'}>
        {data.map((member) => {
          const label = memberLabel(member);
          const showEmail = member.display_name.trim() !== '';

          return (
            <li key={member.user_id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="min-w-0">
                    <p className="m-0 truncate text-sm font-semibold">{label}</p>
                    {showEmail ? (
                      <p className="text-muted m-0 truncate text-xs">{member.email}</p>
                    ) : null}
                  </div>
                  <RoleBadge role={member.role} />
                </div>

                {canManage ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {member.role !== 'owner' ? (
                      <div className="w-36">
                        <SelectField
                          label={t('members.roleFor', { email: label })}
                          hideLabel
                          value={member.role}
                          disabled={updateMember.isPending}
                          onChange={(event) => {
                            const parsed = assignableRoleSchema.safeParse(
                              event.currentTarget.value,
                            );

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
                        </SelectField>
                      </div>
                    ) : null}
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      disabled={deleteMember.isPending}
                      aria-label={t('members.remove', { email: label })}
                      onClick={() => {
                        deleteMember.mutate(member.user_id);
                      }}
                    >
                      {t('common.delete')}
                    </Button>
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
