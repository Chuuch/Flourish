import { Alert, Button } from '@/components/ui';
import { useClients } from '../hooks/useClients';
import { Link } from 'react-router';
import { clientPath, clientTicketsPath, clientUsersPath } from '@/app/router/paths';
import { useI18n } from '@/features/i18n';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';

export function ClientList({ query = '' }: { query?: string }) {
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
  } = useClients(query);
  const { t } = useI18n();

  if (isPending) {
    return <ListSkeleton label={t('clients.loading')} />;
  }

  if (isError) {
    return (
      <Alert>
        <p>{t('clients.loadError', { message: error.message })}</p>
        <Button type="button" variant="ghost" size="sm" onClick={() => void refetch()}>
          {t('common.retry')}
        </Button>
      </Alert>
    );
  }

  const items = data.pages.flatMap((page) => page.items);

  if (items.length === 0) {
    return (
      <p className="text-muted m-0 text-sm">
        {query ? t('clients.noMatches') : t('clients.empty')}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className={isFetching && !isFetchingNextPage ? 'stack-list opacity-70' : 'stack-list'}>
        {items.map((client) => (
          <li key={client.id}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <Link
                  to={clientPath(client.id)}
                  className="text-ink text-sm font-semibold no-underline hover:underline"
                >
                  {client.name}
                </Link>
                {client.notes ? (
                  <p className="text-muted m-0 mt-1 truncate text-sm">{client.notes}</p>
                ) : null}
              </div>
              <div className="action-bar shrink-0">
                <Link
                  to={clientUsersPath(client.id)}
                  className="text-muted hover:text-accent text-sm no-underline"
                >
                  {t('common.users')}
                </Link>
                <span className="text-line" aria-hidden="true">
                  ·
                </span>
                <Link
                  to={clientTicketsPath(client.id)}
                  className="text-muted hover:text-accent text-sm no-underline"
                >
                  {t('common.tickets')}
                </Link>
              </div>
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
