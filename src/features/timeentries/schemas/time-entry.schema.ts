import { t } from '@/features/i18n';
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
    .min(1, { error: () => t('validation.minutesMin') })
    .max(1440, { error: () => t('validation.minutesMax') }),
  notes: z.string().max(2000),
});

export const updateTimeEntrySchema = createTimeEntrySchema;

export type TimeEntry = z.infer<typeof timeEntrySchema>;
export type CreateTimeEntryInput = z.infer<typeof createTimeEntrySchema>;
export type UpdateTimeEntryInput = z.infer<typeof updateTimeEntrySchema>;

export function timeEntryLabel(entry: TimeEntry): string {
  return entry.notes
    ? t('time.labelWithNotes', { minutes: entry.minutes, notes: entry.notes })
    : t('time.label', { minutes: entry.minutes });
}

export function canMutateTimeEntry(
  role: string | null | undefined,
  actorUserId: string | null | undefined,
  entryUserId: string,
): boolean {
  if (role === 'owner' || role === 'admin') {
    return true;
  }

  return role === 'member' && actorUserId === entryUserId;
}
