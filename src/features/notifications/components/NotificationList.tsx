import { clientTicketPath, taskPath } from '@/app/router/paths';
import { Alert, Button } from '@/components/ui';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { useI18n } from '@/features/i18n';
import { formatDateTime } from '@/lib/formatDate';
import { Link } from 'react-router';
import { useNotifications } from '../hooks/useNotifications';
import { useMarkNotificationRead } from '../hooks/useMarkNotificationRead';
import { notificationLine } from '../lib/notificationLine';
import type { Notification } from '../schemas/notification.schema';

function notificationHref(item: Notification): string | null {
  if (item.entity_type === 'ticket' && item.client_id) {
    return clientTicketPath(item.client_id, item.entity_id);
  }

  if (item.entity_type === 'task' && item.client_id && item.project_id) {
    return taskPath(item.client_id, item.project_id, item.entity_id);
  }

  return null;
}

export function NotificationList() {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useNotifications();
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

  const items = data.pages.flatMap((page) => page.items).filter((item) => item.read_at === null);

  if (items.length === 0) {
    return <p className="text-muted m-0 text-sm">{t('notifications.empty')}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="stack-list">
        {items.map((item) => {
          const href = notificationHref(item);
          const line = notificationLine(item);

          return (
            <li key={item.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="bg-accent size-1.5 shrink-0 rounded-full" aria-hidden="true" />
                    <time className="text-muted text-xs" dateTime={item.created_at}>
                      {formatDateTime(item.created_at, locale)}
                    </time>
                  </div>
                  {href ? (
                    <Link
                      to={href}
                      className="mt-1.5 block text-sm leading-relaxed font-medium text-ink no-underline hover:underline"
                    >
                      {line}
                    </Link>
                  ) : (
                    <p className="m-0 mt-1.5 text-sm leading-relaxed font-medium">{line}</p>
                  )}
                </div>
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
              </div>
            </li>
          );
        })}
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
