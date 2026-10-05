import { clientPath, paths } from '@/app/router/paths';
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
        <div className="page-header">
          <h1>{t('projects.title')}</h1>
          <p>{t('clients.notFoundPeriod')}</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <p className="breadcrumb">
        <Link to={paths.clients}>{t('common.clients')}</Link>
        <span aria-hidden="true">/</span>
        <Link to={clientPath(clientId)}>{t('clients.hubCrumb')}</Link>
      </p>
      <div className="page-header">
        <h1>{t('common.projects')}</h1>
      </div>
      <CreateProjectForm clientId={clientId} />
      <ProjectList clientId={clientId} />
    </main>
  );
}
