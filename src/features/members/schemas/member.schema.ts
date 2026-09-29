import { t } from '@/features/i18n';
import { z } from 'zod';

export const memberRoleSchema = z.enum(['owner', 'admin', 'member']);
export const assignableRoleSchema = z.enum(['admin', 'member']);

export const memberSchema = z.object({
  user_id: z.uuid(),
  email: z.email(),
  display_name: z.string().default(''),
  role: memberRoleSchema,
  created_at: z.string(),
});

export const membersSchema = z.array(memberSchema);

export const createMemberSchema = z.object({
  email: z.email({ error: () => t('validation.email') }),
  role: assignableRoleSchema,
});

export const updateMemberSchema = z.object({
  role: assignableRoleSchema,
});

export type Member = z.infer<typeof memberSchema>;
export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
export type MemberRole = z.infer<typeof memberRoleSchema>;

export function memberLabel(member: Pick<Member, 'display_name' | 'email'>): string {
  return member.display_name.trim() === '' ? member.email : member.display_name;
}

export function canManageMembers(role: string | null | undefined): boolean {
  return role === 'owner' || role === 'admin';
}
