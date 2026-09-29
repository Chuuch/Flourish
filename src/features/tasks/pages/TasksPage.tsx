import { clientPath, clientProjectsPath, paths, projectPath } from '@/app/router/paths';
import { Link, useParams } from 'react-router';
import { CreateTaskForm } from '../components/CreateTaskForm';
import { TaskList } from '../components/TaskList';
import { useI18n } from '@/features/i18n';

export function TasksPage() {
  const { clientId, projectId } = useParams();
  const { t } = useI18n();

  if (!clientId || !projectId) {
    return (
      <main>
        <h1>{t('tasks.title')}</h1>
        <p>{t('tasks.notFound')}</p>
      </main>
    );
  }

  return (
    <main>
      <p>
        <Link to={paths.clients}>{t('common.clients')}</Link>
        {' / '}
        <Link to={clientPath(clientId)}>{t('clients.hubCrumb')}</Link>
        {' / '}
        <Link to={clientProjectsPath(clientId)}>{t('common.projects')}</Link>
        {' / '}
        <Link to={projectPath(clientId, projectId)}>{t('projects.hubCrumb')}</Link>
      </p>
      <h1>{t('tasks.title')}</h1>
      <CreateTaskForm projectId={projectId} />
      <TaskList clientId={clientId} projectId={projectId} />
    </main>
  );
}
