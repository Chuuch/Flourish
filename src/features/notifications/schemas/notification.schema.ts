import { z } from 'zod';

export const notificationKindSchema = z.enum([
  'ticket_opened',
  'ticket_client_comment',
  'task_assigned',
  'task_commented',
  'ticket_staff_comment',
  'ticket_status_changed',
  'ticket_converted',
]);

export const notificationSchema = z.object({
  id: z.uuid(),
  organization_id: z.uuid(),
  recipient_id: z.uuid(),
  actor_id: z.uuid(),
  actor_email: z.email(),
  actor_display_name: z.string().default(''),
  kind: notificationKindSchema,
  entity_type: z.string(),
  entity_id: z.uuid(),
  summary: z.string(),
  read_at: z.string().nullable(),
  created_at: z.string(),
});

export const notificationPageSchema = z.object({
  items: z.array(notificationSchema),
  next_cursor: z.string().nullable(),
});

export type Notification = z.infer<typeof notificationSchema>;
export type NotificationPage = z.infer<typeof notificationPageSchema>;
