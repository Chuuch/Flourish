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
    <section className="detail-panel">
      <div className="field-grid field-grid-2">
        <div className="flex flex-col gap-1">
          <h2>{t('invoices.billFrom')}</h2>
          <p className="m-0 text-sm font-semibold">{sellerName}</p>
          {sellerAddress.map((line) => (
            <p key={`seller-${line}`} className="text-muted m-0 text-sm">
              {line}
            </p>
          ))}
          {invoice.seller_vat_id ? (
            <p className="text-muted m-0 text-sm">
              {t('invoices.sellerVat', { id: invoice.seller_vat_id })}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1">
          <h2>{t('invoices.billTo')}</h2>
          <p className="m-0 text-sm font-semibold">{buyerName}</p>
          {buyerAddress.map((line) => (
            <p key={`buyer-${line}`} className="text-muted m-0 text-sm">
              {line}
            </p>
          ))}
          {invoice.buyer_vat_id ? (
            <p className="text-muted m-0 text-sm">
              {t('invoices.buyerVat', { id: invoice.buyer_vat_id })}
            </p>
          ) : null}
        </div>
      </div>

      <div className="border-line flex flex-col gap-2 border-t pt-4">
        <ul className="page-meta">
          <li>
            {t('invoices.regime')}: <strong>{t(regimeKey[invoice.vat_regime])}</strong>
          </li>
          <li>{t('invoices.subtotal', { amount: formatEUR(invoice.subtotal_cents) })}</li>
          {invoice.vat_regime === 'standard' ? (
            <li>
              {t('invoices.vat', {
                rate: formatVATRate(invoice.vat_rate_bps),
                amount: formatEUR(invoice.vat_cents),
              })}
            </li>
          ) : null}
          <li>
            <strong>{t('invoices.total', { amount: formatEUR(invoice.total_cents) })}</strong>
          </li>
        </ul>

        {invoice.bank_iban || invoice.bank_name ? (
          <div className="border-line mt-2 flex flex-col gap-1 border-t pt-3">
            <h2>{t('invoices.bank')}</h2>
            {invoice.bank_name ? <p className="m-0 text-sm">{invoice.bank_name}</p> : null}
            {invoice.bank_iban ? (
              <p className="text-muted m-0 text-sm">
                {t('invoices.iban', { iban: invoice.bank_iban })}
              </p>
            ) : null}
            {invoice.bank_bic ? (
              <p className="text-muted m-0 text-sm">
                {t('invoices.bic', { bic: invoice.bank_bic })}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
