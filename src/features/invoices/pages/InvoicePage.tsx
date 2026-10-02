import { clientInvoicesPath, clientPath, paths } from '@/app/router/paths';
import { Link, useNavigate, useParams } from 'react-router';
import { Alert, Button, TextField } from '@/components/ui';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { useAuthStore } from '@/features/auth';
import { canManageClients } from '@/features/clients/schemas/client.schema';
import { useI18n } from '@/features/i18n';
import { reportRange } from '@/features/reports/lib/reportRange';
import { formatEUR, formatHours } from '../lib/formatMoney';
import { invoiceStatusKey } from '../lib/invoiceStatus';
import { useDeleteInvoice } from '../hooks/useDeleteInvoice';
import { useInvoice } from '../hooks/useInvoice';
import { useMarkInvoicePaid } from '../hooks/useMarkInvoicePaid';
import { useSendInvoice } from '../hooks/useSendInvoice';
import { useUpdateInvoice } from '../hooks/useUpdateInvoice';

export function InvoicePage() {
  const { clientId, invoiceId } = useParams();
  const { t } = useI18n();

  if (!clientId || !invoiceId) {
    return (
      <main>
        <h1>{t('invoices.title')}</h1>
        <p>{t('invoices.notFound')}</p>
      </main>
    );
  }

  return <InvoiceDetail clientId={clientId} invoiceId={invoiceId} />;
}

function InvoiceDetail({ clientId, invoiceId }: { clientId: string; invoiceId: string }) {
  const { data, isPending, isError, error, refetch } = useInvoice(invoiceId);
  const updateInvoice = useUpdateInvoice(clientId, invoiceId);
  const sendInvoice = useSendInvoice(clientId, invoiceId);
  const markPaid = useMarkInvoicePaid(clientId, invoiceId);
  const deleteInvoice = useDeleteInvoice(clientId);
  const navigate = useNavigate();
  const role = useAuthStore((state) => state.role);
  const canManage = canManageClients(role);
  const { t } = useI18n();

  if (isPending) {
    return (
      <main>
        <ListSkeleton label={t('invoices.loading')} />
      </main>
    );
  }

  if (isError) {
    return (
      <main>
        <Alert>
          <p>
            {t('invoices.loadError', {
              message: error instanceof Error ? error.message : '',
            })}
          </p>
          <button type="button" onClick={() => void refetch()}>
            {t('common.retry')}
          </button>
        </Alert>
      </main>
    );
  }

  const fromDate = data.period_from.slice(0, 10);
  const toInclusive = new Date(data.period_to);
  toInclusive.setUTCDate(toInclusive.getUTCDate() - 1);
  const toDate = toInclusive.toISOString().slice(0, 10);

  return (
    <main>
      <p>
        <Link to={paths.clients}>{t('common.clients')}</Link>
        {' / '}
        <Link to={clientPath(clientId)}>{t('clients.hubCrumb')}</Link>
        {' / '}
        <Link to={clientInvoicesPath(clientId)}>{t('invoices.title')}</Link>
      </p>
      <h1>{data.number}</h1>
      <p>{data.organization_name}</p>
      <p>
        {t('invoices.billTo')}: {data.client_name}
      </p>
      <p>
        {t('invoices.statusLabel')}: {t(invoiceStatusKey[data.status])}
      </p>
      <p>
        {t('invoices.issued')}: {data.issued_at.slice(0, 10)}
      </p>
      <p>
        {t('invoices.due')}: {data.due_at.slice(0, 10)}
      </p>
      <p>
        {t('invoices.rate')}: {formatEUR(data.rate_cents)}
      </p>
      <p>{t('invoices.total', { amount: formatEUR(data.total_cents) })}</p>

      <ul>
        {data.lines.map((line) => (
          <li key={line.id}>
            {t('invoices.line', {
              project: line.project_name,
              task: line.task_title,
              hours: formatHours(line.minutes),
              amount: formatEUR(line.amount_cents),
            })}
          </li>
        ))}
      </ul>

      {canManage && data.status === 'draft' ? (
        <>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const fromValue = form.get('from');
              const toValue = form.get('to');
              if (typeof fromValue !== 'string' || typeof toValue !== 'string') {
                return;
              }
              const range = reportRange(fromValue, toValue);
              updateInvoice.mutate({ from: range.from, to: range.to });
            }}
          >
            <TextField
              name="from"
              type="date"
              label={t('reports.from')}
              defaultValue={fromDate}
              required
            />
            <TextField
              name="to"
              type="date"
              label={t('reports.to')}
              defaultValue={toDate}
              required
            />
            <Button type="submit" disabled={updateInvoice.isPending}>
              {t('common.save')}
            </Button>
          </form>
          <Button
            type="button"
            onClick={() => {
              sendInvoice.mutate();
            }}
            disabled={sendInvoice.isPending}
          >
            {t('invoices.send', { number: data.number })}
          </Button>
          <Button
            type="button"
            onClick={() => {
              deleteInvoice.mutate(invoiceId, {
                onSuccess: () => {
                  void navigate(clientInvoicesPath(clientId));
                },
              });
            }}
            disabled={deleteInvoice.isPending}
          >
            {t('invoices.remove', { number: data.number })}
          </Button>
        </>
      ) : null}

      {canManage && data.status === 'sent' ? (
        <Button
          type="button"
          onClick={() => {
            markPaid.mutate();
          }}
          disabled={markPaid.isPending}
        >
          {t('invoices.markPaid', { number: data.number })}
        </Button>
      ) : null}
    </main>
  );
}
