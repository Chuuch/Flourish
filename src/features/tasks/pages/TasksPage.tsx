import { clientPath, clientProjectsPath, paths, projectPath } from '@/app/router/paths';
import { PageHeader } from '@/components/ui';
import { useAuthStore } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { useModal } from '@/features/modal';
import { Link, useParams } from 'react-router';
import { CreateTaskForm } from '../components/CreateTaskForm';
import { TaskList } from '../components/TaskList';
import { canCreateTasks } from '../schemas/task.schema';

export function TasksPage() {
  const { clientId, projectId } = useParams();
  const { t } = useI18n();
  const { openModal, closeModal } = useModal();
  const role = useAuthStore((state) => state.role);
  const canCreate = canCreateTasks(role);

  if (!clientId || !projectId) {
    return (
      <main>
        <PageHeader title={t('tasks.title')} description={t('tasks.notFound')} />
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
      <PageHeader
        title={t('tasks.title')}
        {...(canCreate
          ? {
              createLabel: t('tasks.add'),
              onCreate: () => {
                openModal({
                  title: t('tasks.add'),
                  content: (
                    <CreateTaskForm
                      projectId={projectId}
                      onSuccess={() => {
                        closeModal();
                      }}
                      onCancel={() => {
                        closeModal();
                      }}
                    />
                  ),
                });
              },
            }
          : {})}
      />
      <TaskList clientId={clientId} projectId={projectId} />
    </main>
  );
}
