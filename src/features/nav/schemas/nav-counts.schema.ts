import z from 'zod';

export const navCountsSchema = z.object({
  tasks: z.int().nonnegative(),
  tickets: z.int().nonnegative(),
  unread_notifications: z.int().nonnegative(),
});

export type NavCounst = z.infer<typeof navCountsSchema>;
