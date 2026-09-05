import z from 'zod';

export const userSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const usersSchema = z.array(userSchema);

export const createUserSchema = z.object({
  email: z.email('Enter a valid email address'),
});

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
