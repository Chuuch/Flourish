import { Alert, Button } from '@/components/ui';
import { useProjects } from '../hooks/useProjects';
import { projectFilesPath, projectPath, projectTasksPath } from '@/app/router/paths';
import { Link } from 'react-router';
import { useI18n } from '@/features/i18n';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';

export function ProjectList({ clientId, query = '' }: { clientId: string; query?: string }) {
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
  } = useProjects(clientId, query);
  const { t } = useI18n();

  if (isPending) {
    return <ListSkeleton label={t('projects.loading')} />;
  }

  if (isError) {
    return (
      <Alert>
        <p>{t('projects.loadError', { message: error instanceof Error ? error.message : '' })}</p>
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
        {query ? t('projects.noMatches') : t('projects.empty')}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className={isFetching && !isFetchingNextPage ? 'stack-list opacity-70' : 'stack-list'}>
        {items.map((project) => (
          <li key={project.id}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <Link
                  to={projectPath(clientId, project.id)}
                  className="text-ink text-sm font-semibold no-underline hover:underline"
                >
                  {project.name}
                </Link>
                {project.notes ? (
                  <p className="text-muted m-0 mt-1 truncate text-sm">{project.notes}</p>
                ) : null}
              </div>
              <div className="action-bar shrink-0">
                <Link
                  to={projectTasksPath(clientId, project.id)}
                  className="text-muted hover:text-accent text-sm no-underline"
                >
                  {t('common.tasks')}
                </Link>
                <Link
                  to={projectFilesPath(clientId, project.id)}
                  className="text-muted hover:text-accent text-sm no-underline"
                >
                  {t('common.files')}
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
