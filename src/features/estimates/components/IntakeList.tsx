import { useI18n } from '@/features/i18n';
import { useIntake } from '../hooks/useIntakes';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { Alert, Button } from '@/components/ui';
import { Link } from 'react-router';
import { estimateNewPath, intakeDetailPath } from '@/app/router/paths';

export function IntakeList({ status = '' }: { status?: string }) {
  const { t } = useI18n();
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useIntake(status);

  if (isPending) {
    return <ListSkeleton label={t('intake.listLoading')} />;
  }

  if (isError) {
    return (
      <Alert>
        <p>
          {t('intake.listError', {
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
    return <p className="text-muted m-0 text-sm">{t('intake.listEmpty')}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className={isFetching && !isFetchingNextPage ? 'stack-list opacity-70' : 'stack-list'}>
        {items.map((intake) => (
          <li key={intake.id}>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Link
                  to={intakeDetailPath(intake.id)}
                  className="text-ink text-sm font-semibold no-underline hover:underline"
                >
                  {intake.project_name ||
                    intake.respondent_name ||
                    t(`estimates.category.${intake.category}`)}
                </Link>
                <p className="text-muted m-0 mt-1 text-sm">
                  {t(`estimates.category.${intake.category}`)} · {intake.status}
                  {intake.respondent_email ? ` · ${intake.respondent_email}` : ''}
                </p>
              </div>
              {intake.status === 'submitted' ? (
                <Link
                  to={`${estimateNewPath()}?intakeId=${intake.id}`}
                  className="text-accent text-sm no-underline hover:underline"
                >
                  {t('intake.openEstimator')}
                </Link>
              ) : null}
            </div>
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
