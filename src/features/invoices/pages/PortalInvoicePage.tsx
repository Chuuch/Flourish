import { useI18n } from '@/features/i18n';
import { Link, useParams } from 'react-router';
import { usePortalInvoice } from '../hooks/usePortalInvoice';
import { useDownloadPortalInvoicePdf } from '../hooks/useDownloadPortalInvoicePdf';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { Alert, Button } from '@/components/ui';
import { paths } from '@/app/router/paths';
import { invoiceStatusKey } from '../lib/invoiceStatus';
import { formatEUR, formatHours } from '../lib/formatMoney';

export function PortalInvoicePage() {
  const { invoiceId } = useParams();
  const { t } = useI18n();

  if (!invoiceId) {
    return (
      <main>
        <h1>{t('invoices.title')}</h1>
        <p>{t('invoices.notFound')}</p>
      </main>
    );
  }

  return <PortalInvoiceDetail invoiceId={invoiceId} />;
}

function PortalInvoiceDetail({ invoiceId }: { invoiceId: string }) {
  const { data, isPending, isError, error, refetch } = usePortalInvoice(invoiceId);
  const downloadPdf = useDownloadPortalInvoicePdf();
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

  return (
    <main>
      <p>
        <Link to={paths.portal}>{t('portal.title')}</Link>
        {' / '}
        <Link to={paths.portalInvoices}>{t('invoices.title')}</Link>
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

      <Button
        type="button"
        onClick={() => {
          downloadPdf.mutate(invoiceId);
        }}
        disabled={downloadPdf.isPending}
      >
        {t('invoices.download')}
      </Button>
    </main>
  );
}
