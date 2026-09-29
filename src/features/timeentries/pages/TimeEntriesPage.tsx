import {
  clientPath,
  clientProjectsPath,
  paths,
  projectPath,
  projectTasksPath,
  taskPath,
} from '@/app/router/paths';
import { Link, useParams } from 'react-router';
import { CreateTimeEntryForm } from '../components/CreateTimeEntryForm';
import { TimeEntryList } from '../components/TimeEntryList';
import { useI18n } from '@/features/i18n';

export function TimeEntriesPage() {
  const { clientId, projectId, taskid, taskId: taskIdParam } = useParams();
  const taskId = taskid ?? taskIdParam;
  const { t } = useI18n();

  if (!clientId || !projectId || !taskId) {
    return (
      <main>
        <h1>{t('time.title')}</h1>
        <p>{t('comments.notFound')}</p>
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
        {' / '}
        <Link to={projectTasksPath(clientId, projectId)}>{t('common.tasks')}</Link>
        {' / '}
        <Link to={taskPath(clientId, projectId, taskId)}>{t('tasks.hubCrumb')}</Link>
      </p>
      <h1>{t('time.heading')}</h1>
      <CreateTimeEntryForm taskId={taskId} />
      <TimeEntryList taskId={taskId} />
    </main>
  );
}
