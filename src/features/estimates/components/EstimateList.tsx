import { useI18n } from '@/features/i18n';
import { useEstimates } from '../hooks/useEstimates';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { Alert, Button } from '@/components/ui';
import { Link } from 'react-router';
import { estimatePath } from '@/app/router/paths';
import { formatEUR } from '@/features/invoices/lib/formatMoney';

export function EstimateList({ clientId = '' }: { clientId?: string }) {
  const { t } = useI18n();
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useEstimates(clientId);

  if (isPending) {
    return <ListSkeleton label={t('estimates.loading')} />;
  }

  if (isError) {
    return (
      <Alert>
        <p>
          {t('estimates.loadError', {
            message: error instanceof Error ? error.message : '',
          })}
        </p>
        <Button type="button" variant="ghost" size="sm" onClick={() => void refetch()}>
          {t('common.retry')}
        </Button>
      </Alert>
    );
  }

  const items = data.pages.flatMap((page) => page.items);

  if (items.length === 0) {
    return <p className="text-muted m-0 text-sm">{t('estimates.empty')}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className={isFetching && !isFetchingNextPage ? 'stack-list opacity-70' : 'stack-list'}>
        {items.map((estimate) => (
          <li key={estimate.id}>
            <Link
              to={estimatePath(estimate.id)}
              className="text-ink text-sm font-semibold no-underline hover:underline"
            >
              {estimate.input.project_name || t(`estimates.category.${estimate.category}`)}
            </Link>
            <p className="text-muted m-0 mt-1 text-sm">
              {t(`estimates.category.${estimate.category}`)} ·{' '}
              {t(`estimates.mode.${estimate.mode}`)} · {formatEUR(estimate.recommended_price_cents)}{' '}
              · {estimate.risk_level}
            </p>
          </li>
        ))}
      </ul>

      {hasNextPage ? (
        <div className="form-actions">
          <Button
            type="button"
            variant="ghost"
            disabled={isFetchingNextPage}
            onClick={() => void fetchNextPage()}
          >
            {t('common.loadMore')}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
