import { paths } from '@/app/router/paths';
import { useI18n } from '@/features/i18n';
import { Link } from 'lucide-react';
import { PortalInvoiceList } from '../components/PortalInvoiceList';

export function PortalInvoicesPage() {
  const { t } = useI18n();

  return (
    <main>
      <p>
        <Link to={paths.portal}>{t('portal.title')}</Link>
      </p>
      <h1>{t('invoices.title')}</h1>
      <PortalInvoiceList />
    </main>
  );
}
