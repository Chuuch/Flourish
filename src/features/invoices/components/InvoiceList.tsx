import { useAuthStore } from '@/features/auth';
import { useCreateInvoice } from '../hooks/useCreateInvoice';
import { useInvoices } from '../hooks/useInvoices';
import { canManageClients } from '@/features/clients/schemas/client.schema';
import { defaultReportDates, reportRange } from '@/features/reports/lib/reportRange';
import { useI18n } from '@/features/i18n';
import { Alert, Button, FieldGrid, TextField } from '@/components/ui';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { Link } from 'react-router';
import { invoicePath } from '@/app/router/paths';
import { invoiceStatusKey } from '../lib/invoiceStatus';
import { formatEUR } from '../lib/formatMoney';

export function InvoiceList({ clientId }: { clientId: string }) {
  const { data, isPending, isError, error, refetch } = useInvoices(clientId);
  const createInvoice = useCreateInvoice(clientId);
  const role = useAuthStore((state) => state.role);
  const canManage = canManageClients(role);
  const defaults = defaultReportDates();
  const { t } = useI18n();

  return (
    <>
      {canManage ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const fromDate = form.get('from');
            const toDate = form.get('to');
            if (typeof fromDate !== 'string' || typeof toDate !== 'string') {
              return;
            }
            const range = reportRange(fromDate, toDate);
            createInvoice.mutate({ from: range.from, to: range.to });
          }}
        >
          <FieldGrid>
            <TextField
              name="from"
              type="date"
              label={t('reports.from')}
              defaultValue={defaults.from}
              required
            />
            <TextField
              name="to"
              type="date"
              label={t('reports.to')}
              defaultValue={defaults.to}
              required
            />
          </FieldGrid>
          <div className="form-actions">
            <Button type="submit" disabled={createInvoice.isPending}>
              {t('invoices.create')}
            </Button>
          </div>
        </form>
      ) : null}

      {isPending ? <ListSkeleton label={t('invoices.loading')} /> : null}

      {isError ? (
        <Alert>
          <p>
            {t('invoices.loadError', {
              message: error instanceof Error ? error.message : '',
            })}
          </p>
          <Button type="button" variant="ghost" size="sm" onClick={() => void refetch()}>
            {t('common.retry')}
          </Button>
        </Alert>
      ) : null}

      {data && data.length === 0 ? (
        <p className="text-muted m-0 text-sm">{t('invoices.empty')}</p>
      ) : null}

      {data && data.length > 0 ? (
        <ul>
          {data.map((invoice) => (
            <li key={invoice.id}>
              <Link
                to={invoicePath(clientId, invoice.id)}
                className="text-ink font-semibold no-underline hover:underline"
              >
                {t('invoices.listLine', {
                  number: invoice.number,
                  status: t(invoiceStatusKey[invoice.status]),
                  amount: formatEUR(invoice.total_cents),
                })}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
