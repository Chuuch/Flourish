import { Alert } from '@/components/ui';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { useI18n } from '@/features/i18n';
import { useNotifications } from '../hooks/useNotifications';
import { useMarkNotificationRead } from '../hooks/useMarkNotificationRead';
import { notificationLine } from '../lib/notificationLine';

export function NotificationList() {
  const { data, isPending, isError, error, refetch } = useNotifications();
  const markRead = useMarkNotificationRead();
  const { t } = useI18n();

  if (isPending) {
    return <ListSkeleton label={t('notifications.loading')} />;
  }

  if (isError) {
    return (
      <Alert>
        <p>
          {t('notifications.loadError', {
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
    return <p>{t('notifications.empty')}</p>;
  }

  return (
    <ul>
      {data.map((item) => (
        <li key={item.id}>
          <p>{notificationLine(item)}</p>
          <time dateTime={item.created_at}>{item.created_at}</time>
          {item.read_at === null ? (
            <button
              type="button"
              disabled={markRead.isPending}
              onClick={() => {
                markRead.mutate(item.id);
              }}
            >
              {t('notifications.markRead')}
            </button>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
