import { paths, projectPath } from '@/app/router/paths';
import { Alert, Button } from '@/components/ui';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { useI18n } from '@/features/i18n';
import { formatEUR } from '@/features/invoices/lib/formatMoney';
import { Link, useNavigate, useParams } from 'react-router';
import { CreateProjectFromEstimateForm } from '../components/CreateProjectFromEstimateForm';
import { EstimateResultPanel } from '../components/EstimateResultPanel';
import { useEstimate } from '../hooks/useEstimate';

export function EstimateDetailPage() {
  const { estimateId } = useParams();
  const { t } = useI18n();
  const navigate = useNavigate();
  const estimateQuery = useEstimate(estimateId ?? '');

  if (!estimateId) {
    return (
      <main>
        <div className="page-header">
          <h1>{t('estimates.detailTitle')}</h1>
        </div>
      </main>
    );
  }

  if (estimateQuery.isPending) {
    return (
      <main>
        <ListSkeleton label={t('estimates.loading')} />
      </main>
    );
  }

  if (estimateQuery.isError) {
    return (
      <main>
        <Alert>
          <p>
            {t('estimates.loadError', {
              message: estimateQuery.error.message,
            })}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => void estimateQuery.refetch()}
          >
            {t('common.retry')}
          </Button>
        </Alert>
      </main>
    );
  }

  const estimate = estimateQuery.data;

  return (
    <main>
      <p className="breadcrumb">
        <Link to={paths.estimates}>{t('estimates.title')}</Link>
        <span aria-hidden="true">/</span>
        <span>{estimate.input.project_name || estimate.id.slice(0, 8)}</span>
      </p>
      <div className="page-header">
        <h1>{t('estimates.detailTitle')}</h1>
        <p>
          {t(`estimates.category.${estimate.category}`)} · {t(`estimates.mode.${estimate.mode}`)} ·{' '}
          {formatEUR(estimate.recommended_price_cents)}
        </p>
      </div>

      <EstimateResultPanel result={estimate.result} />

      <CreateProjectFromEstimateForm
        estimateId={estimate.id}
        defaultName={estimate.input.project_name ?? ''}
        onCreated={(projectId, clientId) => {
          void navigate(projectPath(clientId, projectId));
        }}
      />
    </main>
  );
}
