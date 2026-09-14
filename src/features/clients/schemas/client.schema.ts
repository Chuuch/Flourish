import z from 'zod';

export const clientSchema = z.object({
  id: z.uuid(),
  organization_id: z.string(),
  name: z.string().min(1),
  notes: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const clientsSchema = z.array(clientSchema);

export const createClientSchema = z.object({
  name: z.string().min(4, 'Name must be at least 4 characters').max(100),
  notes: z.string().max(2000),
});

export type Client = z.infer<typeof clientSchema>;
export type CreateClientInput = z.infer<typeof createClientSchema>;

export function canManageClients(role: string | null | undefined): boolean {
  return role === 'owner' || role === 'admin';
}
