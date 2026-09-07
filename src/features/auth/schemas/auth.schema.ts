import { z } from 'zod';

export const sessionUserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
});

export const loginInputSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const loginResponseSchema = z.object({
  accessToken: z.string().min(1),
  user: sessionUserSchema,
});

export const refreshResponseSchema = z.object({
  accessToken: z.string().min(1),
});

export const sessionResponseSchema = z.object({
  accessToken: z.string().min(1),
  user: sessionUserSchema,
});

export type SessionUser = z.infer<typeof sessionUserSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
