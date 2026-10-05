import { useI18n, type MessageKey } from '@/features/i18n';
import type { MemberRole } from '../schemas/member.schema';

const roleMessageKeys: Record<MemberRole, MessageKey> = {
  owner: 'role.owner',
  admin: 'role.admin',
  member: 'role.member',
};

export function RoleBadge({ role }: { role: MemberRole }) {
  const { t } = useI18n();

  return (
    <span className="role-badge" data-role={role}>
      {t(roleMessageKeys[role])}
    </span>
  );
}
