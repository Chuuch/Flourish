import { useI18n } from '@/features/i18n';
import { useActivity } from '../hooks/useActivity';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { Alert, Button } from '@/components/ui';
import { formatDateTime } from '@/lib/formatDate';
import { activityLine } from '../lib/activityLabel';

export function ActivityList() {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useActivity();
  const { locale, t } = useI18n();

  if (isPending) {
    return <ListSkeleton label={t('activity.loading')} />;
  }

  if (isError) {
    return (
      <Alert>
        <p>
          {t('activity.loadError', {
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
    return <p className="text-muted m-0 text-sm">{t('activity.empty')}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="stack-list">
        {items.map((event) => (
          <li key={event.id}>
            <div className="row-split">
              <p className="m-0 text-sm leading-relaxed font-medium">{activityLine(event)}</p>
              <time dateTime={event.created_at}>{formatDateTime(event.created_at, locale)}</time>
            </div>
          </li>
        ))}
      </ul>

      {hasNextPage ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="self-start"
          disabled={isFetchingNextPage}
          onClick={() => {
            void fetchNextPage();
          }}
        >
          {t('common.loadMore')}
        </Button>
      ) : null}
    </div>
  );
}
