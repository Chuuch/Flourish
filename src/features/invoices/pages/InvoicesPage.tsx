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
        <div className="page-header">
          <h1>{t('invoices.title')}</h1>
          <p>{t('clients.notFoundPeriod')}</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <p className="breadcrumb">
        <Link to={paths.clients}>{t('common.clients')}</Link>
        <span aria-hidden="true">/</span>
        <Link to={clientPath(clientId)}>{t('clients.hubCrumb')}</Link>
      </p>
      <div className="page-header">
        <h1>{t('invoices.title')}</h1>
      </div>
      <InvoiceList clientId={clientId} />
    </main>
  );
}
