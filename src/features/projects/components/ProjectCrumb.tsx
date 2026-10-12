import { projectPath } from '@/app/router/paths';
import { useI18n } from '@/features/i18n';
import { Link } from 'react-router';
import { useProject } from '../hooks/useProject';

export function ProjectCrumb({ clientId, projectId }: { clientId: string; projectId: string }) {
  const { project } = useProject(clientId, projectId);
  const { t } = useI18n();

  return (
    <Link to={projectPath(clientId, projectId)}>{project?.name ?? t('projects.hubCrumb')}</Link>
  );
}
