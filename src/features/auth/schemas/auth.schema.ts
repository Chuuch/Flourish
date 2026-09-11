import { z } from 'zod';

export const sessionUserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
});

export const loginInputSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const authResponseSchema = z.object({
  access_token: z.string().min(1),
  user: sessionUserSchema,
});

export const loginResponseSchema = authResponseSchema;
export const refreshResponseSchema = authResponseSchema;
export const sessionResponseSchema = authResponseSchema;

export type SessionUser = z.infer<typeof sessionUserSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
