import z from 'zod';

export const userSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type User = z.infer<typeof userSchema>;
