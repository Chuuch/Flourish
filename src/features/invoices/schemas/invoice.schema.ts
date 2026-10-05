import z from 'zod';

export const invoiceLineSchema = z.object({
  id: z.uuid(),
  project_name: z.string(),
  task_title: z.string(),
  minutes: z.int(),
  amount_cents: z.int(),
  position: z.int(),
});

export const vatRegimeSchema = z.enum(['untaxed', 'standard', 'reverse_charge', 'outside_scope']);

export const invoiceSchema = z.object({
  id: z.uuid(),
  organization_id: z.uuid(),
  client_id: z.uuid(),
  number: z.string(),
  status: z.enum(['draft', 'sent', 'paid']),
  currency: z.string(),
  rate_cents: z.number().int(),
  organization_name: z.string(),
  client_name: z.string(),
  seller_legal_name: z.string().default(''),
  seller_registration_number: z.string().default(''),
  seller_vat_id: z.string().default(''),
  seller_address_line1: z.string().default(''),
  seller_address_line2: z.string().default(''),
  seller_city: z.string().default(''),
  seller_postal_code: z.string().default(''),
  seller_country: z.string().default(''),
  buyer_legal_name: z.string().default(''),
  buyer_vat_id: z.string().default(''),
  buyer_address_line1: z.string().default(''),
  buyer_address_line2: z.string().default(''),
  buyer_city: z.string().default(''),
  buyer_postal_code: z.string().default(''),
  buyer_country: z.string().default(''),
  vat_regime: vatRegimeSchema.default('untaxed'),
  vat_rate_bps: z.int().default(2000),
  subtotal_cents: z.int().default(0),
  vat_cents: z.int().default(0),
  bank_iban: z.string().default(''),
  bank_bic: z.string().default(''),
  bank_name: z.string().default(''),
  period_from: z.string(),
  period_to: z.string(),
  issued_at: z.string(),
  due_at: z.string(),
  sent_at: z.string().nullable(),
  paid_at: z.string().nullable(),
  total_minutes: z.number().int(),
  total_cents: z.int(),
  created_at: z.string(),
  updated_at: z.string(),
  lines: z.array(invoiceLineSchema),
});

export const invoicesSchema = z.array(invoiceSchema);

export type Invoice = z.infer<typeof invoiceSchema>;
export type VatRegime = z.infer<typeof vatRegimeSchema>;
