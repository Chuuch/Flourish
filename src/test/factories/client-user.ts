import type { ClientUser } from '@/features/clientusers/schemas/client-user.schema';

export function makeClientUser(overrides: Partial<ClientUser> = {}): ClientUser {
  return {
    user_id: crypto.randomUUID(),
    email: 'pat@northwind.test',
    organization_id: crypto.randomUUID(),
    client_id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    ...overrides,
  };
}
