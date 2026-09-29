import { Alert } from '@/components/ui';
import { useProjects } from '../hooks/useProjects';
import { projectFilesPath, projectPath } from '@/app/router/paths';
import { Link } from 'react-router';
import { useI18n } from '@/features/i18n';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';

export function ProjectList({ clientId }: { clientId: string }) {
  const { data, isPending, isError, error, refetch } = useProjects(clientId);
  const { t } = useI18n();

  if (isPending) {
    return <ListSkeleton label={t('projects.loading')} />;
  }

  if (isError) {
    return (
      <Alert>
        <p>{t('projects.loadError', { message: error instanceof Error ? error.message : '' })}</p>
        <button type="button" onClick={() => void refetch()}>
          {t('common.retry')}
        </button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p>{t('projects.empty')}</p>;
  }

  return (
    <ul>
      {data.map((project) => (
        <li key={project.id}>
          <Link to={projectPath(clientId, project.id)}>
            {project.notes ? `${project.name} - ${project.notes}` : project.name}
          </Link>{' '}
          <Link to={projectFilesPath(clientId, project.id)}>{t('common.files')}</Link>
        </li>
      ))}
    </ul>
  );
}
