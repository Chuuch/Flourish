import { clientPath, paths } from '@/app/router/paths';
import { useI18n } from '@/features/i18n';
import { Link, useParams } from 'react-router';
import { InvoiceList } from '../components/InvoiceList';

export function InvoicesPage() {
  const { clientId } = useParams();
  const { t } = useI18n();

  if (!clientId) {
    return (
      <main>
        <h1>{t('invoices.title')}</h1>
        <p>{t('clients.notFoundPeriod')}</p>
      </main>
    );
  }

  return (
    <main>
      <p>
        <Link to={paths.clients}>{t('common.clients')}</Link>
        {' / '}
        <Link to={clientPath(clientId)}>{t('clients.hubCrumb')}</Link>
      </p>
      <h1>{t('invoices.title')}</h1>
      <InvoiceList clientId={clientId} />
    </main>
  );
}
