import type { Member } from '@/features/members';
import type { UseFormRegisterReturn } from 'react-hook-form';

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
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <select id={id} className="block rounded px-2 py-1" {...registration}>
        <option value="">Unassigned</option>
        {members.map((member) => (
          <option key={member.user_id} value={member.user_id}>
            {member.email}
          </option>
        ))}
      </select>
      {error ? <p role="alert">{error}</p> : null}
    </div>
  );
}
