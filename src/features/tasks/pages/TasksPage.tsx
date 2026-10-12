import { clientProjectsPath, paths } from '@/app/router/paths';
import { PageHeader, SearchField } from '@/components/ui';
import { useAuthStore } from '@/features/auth';
import { ClientCrumb } from '@/features/clients/components/ClientCrumb';
import { useI18n } from '@/features/i18n';
import { useModal } from '@/features/modal';
import { ProjectCrumb } from '@/features/projects/components/ProjectCrumb';
import { useListSearch } from '@/hooks/useListSearch';
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
  const { value, setValue, query } = useListSearch();

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
        <ClientCrumb clientId={clientId} />
        {' / '}
        <Link to={clientProjectsPath(clientId)}>{t('common.projects')}</Link>
        {' / '}
        <ProjectCrumb clientId={clientId} projectId={projectId} />
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
      <div className="mb-4">
        <SearchField
          label={t('common.search')}
          placeholder={t('tasks.searchPlaceholder')}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
        />
      </div>
      <TaskList clientId={clientId} projectId={projectId} query={query} />
    </main>
  );
}
