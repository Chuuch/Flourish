import type { MessageKey } from '@/features/i18n';
import type { Invoice } from '../schemas/invoice.schema';

export const invoiceStatusKey = {
  draft: 'invoices.status.draft',
  sent: 'invoices.status.sent',
  paid: 'invoices.status.paid',
} as const satisfies Record<Invoice['status'], MessageKey>;
