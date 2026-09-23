import type { Ticket } from '@/features/tickets';

export function makeTicket(overrides: Partial<Ticket> = {}): Ticket {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    organization_id: crypto.randomUUID(),
    client_id: crypto.randomUUID(),
    user_id: crypto.randomUUID(),
    kind: 'bug',
    status: 'open',
    title: 'Login button broken',
    body: 'Clicking Sign in does nothing on mobile.',
    version: 1,
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}
