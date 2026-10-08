import type { SessionOrganization } from '@/features/auth/schemas/auth.schema';

export function makeOrganization(
  overrides: Partial<SessionOrganization> = {},
): SessionOrganization {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    name: 'Acme',
    legal_name: '',
    registration_number: '',
    vat_id: '',
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: '',
    country: '',
    default_vat_rate_bps: 2000,
    bank_iban: '',
    bank_bic: '',
    bank_name: '',
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}
