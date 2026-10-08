import { t } from '@/features/i18n';
import z from 'zod';

const countrySchema = z
  .string()
  .max(2)
  .refine((value) => value === '' || value.length === 2, {
    error: () => t('validation.country'),
  });

export const clientSchema = z.object({
  id: z.uuid(),
  organization_id: z.string(),
  name: z.string().min(1),
  notes: z.string(),
  legal_name: z.string().default(''),
  vat_id: z.string().default(''),
  address_line1: z.string().default(''),
  address_line2: z.string().default(''),
  city: z.string().default(''),
  postal_code: z.string().default(''),
  country: countrySchema,
  created_at: z.string(),
  updated_at: z.string(),
});

export const clientsPageSchema = z.object({
  items: z.array(clientSchema),
  next_cursor: z.string().nullable(),
});

export const createClientSchema = z.object({
  name: z
    .string()
    .min(4, { error: () => t('validation.nameMin') })
    .max(100),
  notes: z.string().max(2000),
  legal_name: z.string().max(200),
  vat_id: z.string().max(32),
  address_line1: z.string().max(200),
  address_line2: z.string().max(200),
  city: z.string().max(100),
  postal_code: z.string().max(32),
  country: countrySchema,
});

export const updateClientSchema = createClientSchema;

export type Client = z.infer<typeof clientSchema>;
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;

export function canManageClients(role: string | null | undefined): boolean {
  return role === 'owner' || role === 'admin';
}
