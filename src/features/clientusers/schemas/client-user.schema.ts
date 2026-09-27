import { t } from '@/features/i18n';
import z from 'zod';

export const clientUserSchema = z.object({
  user_id: z.uuid(),
  email: z.email(),
  organization_id: z.string(),
  client_id: z.string(),
  created_at: z.string(),
});

export const clientUsersSchema = z.array(clientUserSchema);

export const createClientUserSchema = z.object({
  email: z.email({ error: () => t('validation.email') }),
});

export type ClientUser = z.infer<typeof clientUserSchema>;
export type CreateClientUserInput = z.infer<typeof createClientUserSchema>;

export function canManageClientUsers(role: string | null | undefined): boolean {
  return role === 'owner' || role === 'admin';
}
