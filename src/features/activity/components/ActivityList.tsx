import { useI18n } from '@/features/i18n';
import { useActivity } from '../hooks/useActivity';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { Alert } from '@/components/ui';
import { activityLine } from '../lib/activityLabel';

export function ActivityList() {
  const { data, isPending, isError, error, refetch } = useActivity();
  const { t } = useI18n();

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
        <button type="button" onClick={() => void refetch()}>
          {t('common.retry')}
        </button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p>{t('activity.empty')}</p>;
  }

  return (
    <ul>
      {data.map((event) => (
        <li key={event.id}>
          <p>{activityLine(event)}</p>
          <time dateTime={event.created_at}>{event.created_at}</time>
        </li>
      ))}
    </ul>
  );
}
