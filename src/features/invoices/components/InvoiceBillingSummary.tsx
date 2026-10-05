import { useI18n } from '@/features/i18n';
import type { Invoice } from '../schemas/invoice.schema';
import { formatEUR, formatVATRate } from '../lib/formatMoney';

const regimeKey = {
  untaxed: 'invoices.vatUntaxed',
  standard: 'invoices.vatStandard',
  reverse_charge: 'invoices.vatReverseCharge',
  outside_scope: 'invoices.vatOutsideScope',
} as const;

function addressLines(
  line1: string,
  line2: string,
  city: string,
  postal: string,
  country: string,
): string[] {
  return [line1, line2, [postal, city].filter(Boolean).join(' '), country].filter(Boolean);
}

export function InvoiceBillingSummary({ invoice }: { invoice: Invoice }) {
  const { t } = useI18n();
  const sellerAddress = addressLines(
    invoice.seller_address_line1,
    invoice.seller_address_line2,
    invoice.seller_city,
    invoice.seller_postal_code,
    invoice.seller_country,
  );
  const buyerAddress = addressLines(
    invoice.buyer_address_line1,
    invoice.buyer_address_line2,
    invoice.buyer_city,
    invoice.buyer_postal_code,
    invoice.buyer_country,
  );
  const sellerName = invoice.seller_legal_name || invoice.organization_name;
  const buyerName = invoice.buyer_legal_name || invoice.client_name;

  return (
    <section>
      <p>
        {t('invoices.billFrom')}: {sellerName}
      </p>
      {sellerAddress.map((line) => (
        <p key={`seller-${line}`}>{line}</p>
      ))}
      {invoice.seller_vat_id ? (
        <p>{t('invoices.sellerVat', { id: invoice.seller_vat_id })}</p>
      ) : null}

      <p>
        {t('invoices.billTo')}: {buyerName}
      </p>
      {buyerAddress.map((line) => (
        <p key={`buyer-${line}`}>{line}</p>
      ))}
      {invoice.buyer_vat_id ? <p>{t('invoices.buyerVat', { id: invoice.buyer_vat_id })}</p> : null}

      <p>
        {t('invoices.regime')}: {t(regimeKey[invoice.vat_regime])}
      </p>
      <p>{t('invoices.subtotal', { amount: formatEUR(invoice.subtotal_cents) })}</p>
      {invoice.vat_regime === 'standard' ? (
        <p>
          {t('invoices.vat', {
            rate: formatVATRate(invoice.vat_rate_bps),
            amount: formatEUR(invoice.vat_cents),
          })}
        </p>
      ) : null}
      <p>{t('invoices.total', { amount: formatEUR(invoice.total_cents) })}</p>

      {invoice.bank_iban || invoice.bank_name ? (
        <>
          <p>{t('invoices.bank')}</p>
          {invoice.bank_name ? <p>{invoice.bank_name}</p> : null}
          {invoice.bank_iban ? <p>{t('invoices.iban', { iban: invoice.bank_iban })}</p> : null}
          {invoice.bank_bic ? <p>{t('invoices.bic', { bic: invoice.bank_bic })}</p> : null}
        </>
      ) : null}
    </section>
  );
}
