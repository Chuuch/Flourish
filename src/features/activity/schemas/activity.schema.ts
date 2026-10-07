import z from 'zod';

export const activityActionSchema = z.enum(['created', 'updated', 'deleted', 'converted']);
export const activityEntitySchema = z.enum([
  'task',
  'ticket',
  'file',
  'ticket_file',
  'comment',
  'ticket_comment',
]);

export const activityEventSchema = z.object({
  id: z.uuid(),
  organization_id: z.uuid(),
  actor_id: z.uuid(),
  actor_email: z.string().default(''),
  actor_display_name: z.string().default(''),
  action: activityActionSchema,
  entity_type: activityEntitySchema,
  entity_id: z.uuid(),
  summary: z.string(),
  created_at: z.string(),
});

export const activityPageSchema = z.object({
  items: z.array(activityEventSchema),
  next_cursor: z.string().nullable(),
});

export type ActivityEvent = z.infer<typeof activityEventSchema>;
export type ActivityAction = z.infer<typeof activityActionSchema>;
export type ActivityEntity = z.infer<typeof activityEntitySchema>;
export type ActivityPage = z.infer<typeof activityPageSchema>;
