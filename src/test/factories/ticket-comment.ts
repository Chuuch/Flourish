import type { TicketComment } from '@/features/tickets/schemas/ticket-comment.schema';

export function makeTicketComment(overrides: Partial<TicketComment> = {}): TicketComment {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    organization_id: crypto.randomUUID(),
    ticket_id: crypto.randomUUID(),
    user_id: crypto.randomUUID(),
    body: 'Can you try another browser?',
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}
