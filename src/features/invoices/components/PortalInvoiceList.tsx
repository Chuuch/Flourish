import { useI18n } from '@/features/i18n';
import { usePortalInvoices } from '../hooks/usePortalInvoices';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { Alert, Button } from '@/components/ui';
import { Link } from 'react-router';
import { portalInvoicePath } from '@/app/router/paths';
import { invoiceStatusKey } from '../lib/invoiceStatus';
import { formatEUR } from '../lib/formatMoney';

export function PortalInvoiceList() {
  const { data, isPending, isError, error, refetch } = usePortalInvoices();
  const { t } = useI18n();

  if (isPending) {
    return <ListSkeleton label={t('invoices.loading')} />;
  }

  if (isError) {
    return (
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
    );
  }

  if (data.length === 0) {
    return <p>{t('invoices.empty')}</p>;
  }

  return (
    <ul>
      {data.map((invoice) => (
        <li key={invoice.id}>
          <Link to={portalInvoicePath(invoice.id)}>
            {t('invoices.listLine', {
              number: invoice.number,
              status: t(invoiceStatusKey[invoice.status]),
              amount: formatEUR(invoice.total_cents),
            })}
          </Link>
        </li>
      ))}
    </ul>
  );
}
