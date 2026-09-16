import z from 'zod';

export const timeEntrySchema = z.object({
  id: z.uuid(),
  organization_id: z.string(),
  task_id: z.string(),
  user_id: z.string(),
  minutes: z.number().int(),
  notes: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const timeEntriesSchema = z.array(timeEntrySchema);

export const createTimeEntrySchema = z.object({
  minutes: z
    .number()
    .int()
    .min(1, 'Minutes must be at least 1')
    .max(1440, 'Minutes must be at most 1440'),
  notes: z.string().max(2000),
});

export type TimeEntry = z.infer<typeof timeEntrySchema>;
export type CreateTimeEntryInput = z.infer<typeof createTimeEntrySchema>;
