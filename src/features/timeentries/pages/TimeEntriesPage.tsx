import {
  clientPath,
  clientProjectsPath,
  paths,
  projectPath,
  projectTasksPath,
  taskPath,
} from '@/app/router/paths';
import { PageHeader } from '@/components/ui';
import { useI18n } from '@/features/i18n';
import { useModal } from '@/features/modal';
import { Link, useParams } from 'react-router';
import { CreateTimeEntryForm } from '../components/CreateTimeEntryForm';
import { TimeEntryList } from '../components/TimeEntryList';

export function TimeEntriesPage() {
  const { clientId, projectId, taskid, taskId: taskIdParam } = useParams();
  const taskId = taskid ?? taskIdParam;
  const { t } = useI18n();
  const { openModal, closeModal } = useModal();

  if (!clientId || !projectId || !taskId) {
    return (
      <main>
        <PageHeader title={t('time.title')} description={t('comments.notFound')} />
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
      <PageHeader
        title={t('time.heading')}
        createLabel={t('time.add')}
        onCreate={() => {
          openModal({
            title: t('time.add'),
            content: (
              <CreateTimeEntryForm
                taskId={taskId}
                onSuccess={() => {
                  closeModal();
                }}
                onCancel={() => {
                  closeModal();
                }}
              />
            ),
          });
        }}
      />
      <TimeEntryList taskId={taskId} />
    </main>
  );
}
