import z from 'zod';

export const ticketCommentSchema = z.object({
  id: z.uuid(),
  organization_id: z.string(),
  ticket_id: z.string(),
  user_id: z.string(),
  body: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ticketCommentsSchema = z.array(ticketCommentSchema);

export const createTicketCommentSchema = z.object({
  body: z.string().min(1, 'Body is required').max(2000),
});

export type TicketComment = z.infer<typeof ticketCommentSchema>;
export type CreateTicketCommentInput = z.infer<typeof createTicketCommentSchema>;
