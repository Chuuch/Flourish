import { Link, useParams } from 'react-router';
import {
  clientPath,
  clientProjectsPath,
  paths,
  projectFilesPath,
  projectTasksPath,
} from '@/app/router/paths';
import { Alert, Button } from '@/components/ui';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { useAuthStore } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { useFiles } from '@/features/files/hooks/useFiles';
import { useTasks } from '@/features/tasks/hooks/useTasks';
import { ProjectManageForm } from '../components/ProjectManageForm';
import { useProject } from '../hooks/useProject';
import { canManageProjects } from '../schemas/project.schema';

export function ProjectHubPage() {
  const { clientId, projectId } = useParams();
  const role = useAuthStore((state) => state.role);
  const { t } = useI18n();

  if (!clientId || !projectId) {
    return (
      <main>
        <div className="page-header">
          <h1>{t('projects.title')}</h1>
          <p>{t('projects.notFound')}</p>
        </div>
      </main>
    );
  }

  return (
    <ProjectHub clientId={clientId} projectId={projectId} canManage={canManageProjects(role)} />
  );
}

function ProjectHub({
  clientId,
  projectId,
  canManage,
}: {
  clientId: string;
  projectId: string;
  canManage: boolean;
}) {
  const { project, isPending, isError, error, refetch } = useProject(clientId, projectId);
  const tasks = useTasks(projectId);
  const files = useFiles(projectId);
  const { t } = useI18n();

  if (isPending) {
    return (
      <main>
        <ListSkeleton label={t('projects.loading')} />
      </main>
    );
  }

  if (isError) {
    const message = error instanceof Error ? error.message : '';

    return (
      <main>
        <Alert>
          <p>{t('projects.loadError', { message })}</p>
          <Button type="button" variant="ghost" size="sm" onClick={() => void refetch()}>
            {t('common.retry')}
          </Button>
        </Alert>
      </main>
    );
  }

  if (!project) {
    return (
      <main>
        <p className="breadcrumb">
          <Link to={paths.clients}>{t('common.clients')}</Link>
          <span aria-hidden="true">/</span>
          <Link to={clientPath(clientId)}>{t('clients.hubCrumb')}</Link>
          <span aria-hidden="true">/</span>
          <Link to={clientProjectsPath(clientId)}>{t('common.projects')}</Link>
        </p>
        <div className="page-header">
          <h1>{t('projects.notFound')}</h1>
        </div>
      </main>
    );
  }

  const nav = [
    {
      to: projectTasksPath(clientId, projectId),
      label: t('common.tasks'),
      count: tasks.data?.pages.flatMap((page) => page.items).length,
    },
    {
      to: projectFilesPath(clientId, projectId),
      label: t('common.files'),
      count: files.data?.length,
    },
  ] as const;

  return (
    <main className="client-hub">
      <p className="breadcrumb">
        <Link to={paths.clients}>{t('common.clients')}</Link>
        <span aria-hidden="true">/</span>
        <Link to={clientPath(clientId)}>{t('clients.hubCrumb')}</Link>
        <span aria-hidden="true">/</span>
        <Link to={clientProjectsPath(clientId)}>{t('common.projects')}</Link>
      </p>
      <div className="page-header">
        <h1>{project.name}</h1>
        <p>{project.notes ? project.notes : t('projects.notesEmpty')}</p>
      </div>

      <nav className="hub-nav" aria-label={project.name}>
        {nav.map((item) => (
          <Link key={item.to} to={item.to} className="hub-nav-link">
            <span>{item.label}</span>
            {typeof item.count === 'number' ? (
              <span className="hub-nav-count">{item.count}</span>
            ) : null}
          </Link>
        ))}
      </nav>

      {canManage ? (
        <details className="settings-disclosure">
          <summary>{t('projects.settingsHeading')}</summary>
          <ProjectManageForm clientId={clientId} project={project} />
        </details>
      ) : null}
    </main>
  );
}
