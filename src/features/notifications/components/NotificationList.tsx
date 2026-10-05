import { Alert, Button } from '@/components/ui';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { useI18n } from '@/features/i18n';
import { formatDateTime } from '@/lib/formatDate';
import { useNotifications } from '../hooks/useNotifications';
import { useMarkNotificationRead } from '../hooks/useMarkNotificationRead';
import { notificationLine } from '../lib/notificationLine';

export function NotificationList() {
  const { data, isPending, isError, error, refetch } = useNotifications();
  const markRead = useMarkNotificationRead();
  const { locale, t } = useI18n();

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
        <Button type="button" variant="ghost" size="sm" onClick={() => void refetch()}>
          {t('common.retry')}
        </Button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p className="text-muted m-0 text-sm">{t('notifications.empty')}</p>;
  }

  return (
    <ul className="stack-list">
      {data.map((item) => {
        const unread = item.read_at === null;

        return (
          <li key={item.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {unread ? (
                    <span className="bg-accent size-1.5 shrink-0 rounded-full" aria-hidden="true" />
                  ) : null}
                  <time className="text-muted text-xs" dateTime={item.created_at}>
                    {formatDateTime(item.created_at, locale)}
                  </time>
                </div>
                <p className="m-0 mt-1.5 text-sm leading-relaxed font-medium">
                  {notificationLine(item)}
                </p>
              </div>
              {unread ? (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={markRead.isPending}
                  onClick={() => {
                    markRead.mutate(item.id);
                  }}
                >
                  {t('notifications.markRead')}
                </Button>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
