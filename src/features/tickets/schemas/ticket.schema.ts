import z from 'zod';

export const ticketKindSchema = z.enum(['bug', 'feature', 'question', 'other']);
export const ticketStatusSchema = z.enum(['open', 'in_progress', 'resolved', 'closed']);

export const ticketSchema = z.object({
  id: z.string(),
  organization_id: z.string(),
  client_id: z.string(),
  user_id: z.string(),
  kind: ticketKindSchema,
  status: ticketStatusSchema,
  title: z.string().min(1),
  body: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ticketsSchema = z.array(ticketSchema);

export const createTicketSchema = z.object({
  kind: ticketKindSchema,
  title: z.string().min(4, 'Title must be at least 4 characters').max(100),
  body: z.string().min(1, 'Body is required').max(2000),
});

export const updateTicketSchema = z.object({
  status: ticketStatusSchema,
});

export type Ticket = z.infer<typeof ticketSchema>;
export type TicketKind = z.infer<typeof ticketKindSchema>;
export type TicketStatus = z.infer<typeof ticketStatusSchema>;
export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
