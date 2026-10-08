import { paths } from '@/app/router/paths';
import { PageHeader, SearchField } from '@/components/ui';
import { useAuthStore } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { useModal } from '@/features/modal';
import { PortalInvoiceList } from '@/features/invoices/components/PortalInvoiceList';
import { CreateTicketForm, TicketList } from '@/features/tickets';
import { useListSearch } from '@/hooks/useListSearch';
import { Link } from 'react-router';

export function PortalHomePage() {
  const user = useAuthStore((state) => state.user);
  const client = useAuthStore((state) => state.client);
  const { t } = useI18n();
  const { openModal, closeModal } = useModal();
  const { value, setValue, query } = useListSearch();

  return (
    <main>
      <PageHeader
        title={t('portal.title')}
        description={[user?.email, client?.name].filter(Boolean).join(' · ')}
      />

      <section className="flex flex-col gap-4">
        <PageHeader
          title={t('common.tickets')}
          createLabel={t('tickets.submit')}
          onCreate={() => {
            openModal({
              title: t('tickets.submit'),
              content: (
                <CreateTicketForm
                  onSuccess={() => {
                    closeModal();
                  }}
                  onCancel={() => {
                    closeModal();
                  }}
                />
              ),
            });
          }}
        />
        <SearchField
          label={t('common.search')}
          placeholder={t('tickets.searchPlaceholder')}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
        />
        <TicketList query={query} />
      </section>

      <section className="flex flex-col gap-4">
        <h2>
          <Link to={paths.portalInvoices}>{t('common.invoices')}</Link>
        </h2>
        <PortalInvoiceList />
      </section>
    </main>
  );
}
