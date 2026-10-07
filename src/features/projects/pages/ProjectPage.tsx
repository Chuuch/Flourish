import { clientPath, paths } from '@/app/router/paths';
import { PageHeader } from '@/components/ui';
import { useAuthStore } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { useModal } from '@/features/modal';
import { Link, useParams } from 'react-router';
import { CreateProjectForm } from '../components/CreateProjectForm';
import { ProjectList } from '../components/ProjectList';
import { canManageProjects } from '../schemas/project.schema';

export function ProjectsPage() {
  const { clientId } = useParams();
  const { t } = useI18n();
  const { openModal, closeModal } = useModal();
  const role = useAuthStore((state) => state.role);
  const canCreate = canManageProjects(role);

  if (!clientId) {
    return (
      <main>
        <PageHeader title={t('projects.title')} description={t('clients.notFoundPeriod')} />
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
      <PageHeader
        title={t('common.projects')}
        {...(canCreate
          ? {
              createLabel: t('projects.add'),
              onCreate: () => {
                openModal({
                  title: t('projects.add'),
                  content: (
                    <CreateProjectForm
                      clientId={clientId}
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
      <ProjectList clientId={clientId} />
    </main>
  );
}
