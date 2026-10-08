import type { Invoice } from '@/features/invoices/schemas/invoice.schema';

export function makeInvoice(overrides: Partial<Invoice> = {}): Invoice {
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const organizationId = crypto.randomUUID();
  const clientId = crypto.randomUUID();

  return {
    id,
    organization_id: organizationId,
    client_id: clientId,
    number: 'INV-2026-0001',
    status: 'draft',
    currency: 'EUR',
    rate_cents: 3000,
    organization_name: 'Acme',
    client_name: 'Northwind',
    seller_legal_name: '',
    seller_registration_number: '',
    seller_vat_id: '',
    seller_address_line1: '',
    seller_address_line2: '',
    seller_city: '',
    seller_postal_code: '',
    seller_country: '',
    buyer_legal_name: '',
    buyer_vat_id: '',
    buyer_address_line1: '',
    buyer_address_line2: '',
    buyer_city: '',
    buyer_postal_code: '',
    buyer_country: '',
    vat_regime: 'untaxed',
    vat_rate_bps: 2000,
    subtotal_cents: 4500,
    vat_cents: 0,
    bank_iban: '',
    bank_bic: '',
    bank_name: '',
    period_from: '2026-09-28T00:00:00.000Z',
    period_to: '2026-10-05T00:00:00.000Z',
    issued_at: '2026-10-01T12:00:00.000Z',
    due_at: '2026-10-15T12:00:00.000Z',
    sent_at: null,
    paid_at: null,
    total_minutes: 90,
    total_cents: 4500,
    created_at: now,
    updated_at: now,
    lines: [
      {
        id: crypto.randomUUID(),
        project_name: 'Portal',
        task_title: 'Draw',
        minutes: 90,
        amount_cents: 4500,
        position: 1,
      },
    ],
    ...overrides,
  };
}
