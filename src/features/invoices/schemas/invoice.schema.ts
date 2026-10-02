import z from 'zod';

export const invoiceLineSchema = z.object({
  id: z.uuid(),
  project_name: z.string(),
  task_title: z.string(),
  minutes: z.int(),
  amount_cents: z.int(),
  position: z.int(),
});

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
