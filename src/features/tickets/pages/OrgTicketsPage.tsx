import { useI18n } from '@/features/i18n';
import { OrgTicketList } from '../components/OrgTicketList';

export function OrgTicketsPage() {
  const { t } = useI18n();

  return (
    <main>
      <div className="page-header">
        <h1>{t('tickets.title')}</h1>
      </div>
      <OrgTicketList />
    </main>
  );
}
