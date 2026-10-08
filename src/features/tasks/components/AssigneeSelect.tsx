import { useI18n } from '@/features/i18n';
import type { Member } from '@/features/members';
import { memberLabel } from '@/features/members/schemas/member.schema';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { SelectField } from '@/components/ui';

export function AssigneeSelect({
  id,
  label,
  members,
  error,
  registration,
}: {
  id: string;
  label: string;
  members: Member[];
  error?: string | undefined;
  registration: UseFormRegisterReturn;
}) {
  const { t } = useI18n();
  return (
    <SelectField id={id} label={label} error={error} {...registration}>
      <option value="">{t('tasks.unassigned')}</option>
      {members.map((member) => (
        <option key={member.user_id} value={member.user_id}>
          {memberLabel(member)}
        </option>
      ))}
    </SelectField>
  );
}
