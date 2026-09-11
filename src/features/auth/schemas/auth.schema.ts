import { z } from 'zod';

export const sessionUserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
});

export const sessionOrganizationSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  created_at: z.string(),
  updated_at: z.string(),
});

export const loginInputSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerInputSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  organization_name: z.string().min(2, 'Organization name must be at least 2 characters').max(100),
});

export const authResponseSchema = z.object({
  access_token: z.string().min(1),
  user: sessionUserSchema,
  organization: sessionOrganizationSchema,
});

export const loginResponseSchema = authResponseSchema;
export const refreshResponseSchema = authResponseSchema;
export const sessionResponseSchema = authResponseSchema;
export const registerResponseSchema = authResponseSchema;

export type SessionUser = z.infer<typeof sessionUserSchema>;
export type SessionOrganization = z.infer<typeof sessionOrganizationSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
export type RegisterInput = z.infer<typeof registerInputSchema>;
