import { paths } from '@/app/router/paths';
import { Link, useParams } from 'react-router';
import { CreateProjectForm } from '../components/CreateProjectForm';
import { ProjectList } from '../components/ProjectList';
import { useI18n } from '@/features/i18n';

export function ProjectsPage() {
  const { clientId } = useParams();
  const { t } = useI18n();

  if (!clientId) {
    return (
      <main>
        <h1>{t('projects.title')}</h1>
        <p>{t('clients.notFoundPeriod')}</p>
      </main>
    );
  }

  return (
    <main>
      <p>
        <Link to={paths.clients}>{t('common.clients')}</Link>
      </p>
      <h1>{t('common.projects')}</h1>
      <CreateProjectForm clientId={clientId} />
      <ProjectList clientId={clientId} />
    </main>
  );
}
