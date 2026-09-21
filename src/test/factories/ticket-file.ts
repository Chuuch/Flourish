import type { TicketFile } from '@/features/tickets';

export function makeTicketFile(overrides: Partial<TicketFile> = {}): TicketFile {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    organization_id: crypto.randomUUID(),
    ticket_id: crypto.randomUUID(),
    uploaded_by: crypto.randomUUID(),
    filename: 'bug.png',
    content_type: 'image/png',
    size: 2048,
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}
