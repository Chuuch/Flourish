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
  email: z.email('Enter a valid email address'),
});

export type ClientUser = z.infer<typeof clientUserSchema>;
export type CreateClientUserInput = z.infer<typeof createClientUserSchema>;

export function canManageClientUsers(role: string | null | undefined): boolean {
  return role === 'owner' || role === 'admin';
}
