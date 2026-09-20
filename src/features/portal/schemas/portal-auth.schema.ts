import { sessionOrganizationSchema, sessionUserSchema } from '@/features/auth/schemas/auth.schema';
import z from 'zod';

export const sessionClientSchema = z.object({
  id: z.uuid(),
  organization_id: z.string(),
  name: z.string().min(1),
  notes: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const portalAuthResponseSchema = z.object({
  access_token: z.string().min(1),
  user: sessionUserSchema,
  organization: sessionOrganizationSchema,
  client: sessionClientSchema,
  role: z.literal('client'),
});

export type SessionClient = z.infer<typeof sessionClientSchema>;
export type PortalAuthResponse = z.infer<typeof portalAuthResponseSchema>;
