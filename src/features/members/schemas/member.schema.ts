import { z } from 'zod';

export const memberRoleSchema = z.enum(['owner', 'admin', 'member']);
export const assignableRoleSchema = z.enum(['admin', 'member']);

export const memberSchema = z.object({
  user_id: z.uuid(),
  email: z.email(),
  role: memberRoleSchema,
  created_at: z.string(),
});

export const membersSchema = z.array(memberSchema);

export const createMemberSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: assignableRoleSchema,
});

export type Member = z.infer<typeof memberSchema>;
export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type MemberRole = z.infer<typeof memberRoleSchema>;

export function canManageMembers(role: string | null | undefined): boolean {
  return role === 'owner' || role === 'admin';
}
