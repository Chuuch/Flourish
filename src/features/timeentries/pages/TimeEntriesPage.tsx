import { clientProjectsPath, paths, projectTasksPath } from '@/app/router/paths';
import { Link, useParams } from 'react-router';
import { CreateTimeEntryForm } from '../components/CreateTimeEntryForm';
import { TimeEntryList } from '../components/TimeEntryList';
import { useI18n } from '@/features/i18n';

export function TimeEntriesPage() {
  const { clientId, projectId, taskId } = useParams();
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
        <Link to={clientProjectsPath(clientId)}>{t('common.projects')}</Link>
        {' / '}
        <Link to={projectTasksPath(clientId, projectId)}>{t('common.tasks')}</Link>
      </p>
      <h1>{t('time.heading')}</h1>
      <CreateTimeEntryForm taskId={taskId} />
      <TimeEntryList taskId={taskId} />
    </main>
  );
}
