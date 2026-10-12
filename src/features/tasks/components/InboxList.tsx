import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { taskPath } from '@/app/router/paths';
import { Alert, Button, Radio } from '@/components/ui';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { useAuthStore } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { useInbox } from '../hooks/useInbox';
import { type TaskStatus } from '../schemas/task.schema';

type InboxFilter = 'all' | 'mine' | 'unassigned';

function statusLabel(
  status: TaskStatus,
  t: (key: 'tasks.todo' | 'tasks.inProgress' | 'tasks.done') => string,
): string {
  switch (status) {
    case 'in_progress':
      return t('tasks.inProgress');
    case 'done':
      return t('tasks.done');
    default:
      return t('tasks.todo');
  }
}

export function InboxList({ query = '' }: { query?: string }) {
  const userId = useAuthStore((state) => state.user?.id);
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
  } = useInbox(query);
  const [filter, setFilter] = useState<InboxFilter>('mine');
  const { t } = useI18n();

  const items = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

  const filteredItems = useMemo(() => {
    if (filter === 'mine') {
      return items.filter((task) => task.assignee_id === userId);
    }

    if (filter === 'unassigned') {
      return items.filter((task) => task.assignee_id === null);
    }

    return items;
  }, [filter, items, userId]);

  if (isPending) {
    return <ListSkeleton label={t('inbox.loading')} />;
  }

  if (isError) {
    return (
      <Alert>
        <p>{t('inbox.loadError', { message: error.message })}</p>
        <Button type="button" variant="ghost" size="sm" onClick={() => void refetch()}>
          {t('common.retry')}
        </Button>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <fieldset className="inbox-filters">
        <legend>{t('inbox.filter')}</legend>
        <Radio
          name="inbox-filter"
          value="all"
          label={t('inbox.filterAll')}
          checked={filter === 'all'}
          onChange={() => {
            setFilter('all');
          }}
        />
        <Radio
          name="inbox-filter"
          value="mine"
          label={t('inbox.filterMine')}
          checked={filter === 'mine'}
          onChange={() => {
            setFilter('mine');
          }}
        />
        <Radio
          name="inbox-filter"
          value="unassigned"
          label={t('inbox.filterUnassigned')}
          checked={filter === 'unassigned'}
          onChange={() => {
            setFilter('unassigned');
          }}
        />
      </fieldset>

      {filteredItems.length === 0 ? (
        <p className="text-muted m-0 text-sm">{query ? t('inbox.noMatches') : t('inbox.empty')}</p>
      ) : (
        <>
          <ul
            className={isFetching && !isFetchingNextPage ? 'stack-list opacity-70' : 'stack-list'}
          >
            {filteredItems.map((task) => (
              <li key={task.id} className="p-0!">
                <Link
                  to={taskPath(task.client_id, task.project_id, task.id)}
                  className="hover:bg-canvas-elevated/60 flex w-full items-start justify-between gap-3 px-[0.9rem] py-3 text-left no-underline transition-colors duration-150 focus-visible:outline-none focus-visible:shadow-(--focus-ring)"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink">
                      {task.title}
                    </span>
                    {task.notes ? (
                      <span className="text-muted mt-0.5 block truncate text-xs leading-relaxed">
                        {task.notes}
                      </span>
                    ) : null}
                  </span>
                  <span className="text-muted shrink-0 text-xs font-medium tabular-nums">
                    {statusLabel(task.status, t)}
                  </span>
                </Link>
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
        </>
      )}
    </div>
  );
}
