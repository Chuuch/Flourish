import { useI18n } from '@/features/i18n';
import { useActivity } from '../hooks/useActivity';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { Alert, Button } from '@/components/ui';
import { formatDateTime } from '@/lib/formatDate';
import { activityLine } from '../lib/activityLabel';

export function ActivityList() {
  const { data, isPending, isError, error, refetch } = useActivity();
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

  if (data.length === 0) {
    return <p className="text-muted m-0 text-sm">{t('activity.empty')}</p>;
  }

  return (
    <ul className="stack-list">
      {data.map((event) => (
        <li key={event.id}>
          <div className="row-split">
            <p className="m-0 text-sm leading-relaxed font-medium">{activityLine(event)}</p>
            <time dateTime={event.created_at}>{formatDateTime(event.created_at, locale)}</time>
          </div>
        </li>
      ))}
    </ul>
  );
}
