import { useI18n } from '@/features/i18n';
import type { EstimateResult } from '../schemas/estimate.schema';
import { FormSection } from '@/components/ui';
import { formatEUR } from '@/features/invoices/lib/formatMoney';

export function EstimateResultPanel({ result }: { result: EstimateResult }) {
  const { t } = useI18n();

  return (
    <FormSection title={t('estimates.result')}>
      <ul className="page-meta">
        {result.estimated_hours != null ? (
          <li>
            {t('estimates.hours')}: {result.estimated_hours}
          </li>
        ) : null}
        {result.hours_per_month != null ? (
          <li>
            {t('estimates.hoursPerMonth')}: {result.hours_per_month}
          </li>
        ) : null}
        {result.estimated_timeline_days != null ? (
          <li>
            {t('estimates.timeline')}: {result.estimated_timeline_days}
          </li>
        ) : null}
        <li>
          {t('estimates.minimum')}: {formatEUR(result.minimum_price_cents)}
        </li>
        <li>
          {t('estimates.recommended')}: {formatEUR(result.recommended_price_cents)}
        </li>
        <li>
          {t('estimates.risk')}: {formatEUR(result.recommended_price_cents)}
        </li>
      </ul>

      {result.drivers.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold">{t('estimates.expensive')}</h3>
          <ul className="stack-list">
            {result.expensive_factors.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {result.risk_factors.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold">{t('estimates.riskFactors')}</h3>
          <ul className="stack-list">
            {result.risk_factors.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </FormSection>
  );
}
