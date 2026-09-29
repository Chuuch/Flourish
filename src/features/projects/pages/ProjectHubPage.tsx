import { Link, useParams } from 'react-router';
import {
  clientPath,
  clientProjectsPath,
  paths,
  projectFilesPath,
  projectTasksPath,
} from '@/app/router/paths';
import { Alert } from '@/components/ui';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { useAuthStore } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { fileLabel } from '@/features/files/schemas/file.schema';
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
        <h1>{t('projects.title')}</h1>
        <p>{t('projects.notFound')}</p>
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
          <button type="button" onClick={() => void refetch()}>
            {t('common.retry')}
          </button>
        </Alert>
      </main>
    );
  }

  if (!project) {
    return (
      <main>
        <p>
          <Link to={paths.clients}>{t('common.clients')}</Link>
          {' / '}
          <Link to={clientPath(clientId)}>{t('clients.hubCrumb')}</Link>
          {' / '}
          <Link to={clientProjectsPath(clientId)}>{t('common.projects')}</Link>
        </p>
        <h1>{t('projects.notFound')}</h1>
      </main>
    );
  }

  return (
    <main className="client-hub">
      <p>
        <Link to={paths.clients}>{t('common.clients')}</Link>
        {' / '}
        <Link to={clientPath(clientId)}>{t('clients.hubCrumb')}</Link>
        {' / '}
        <Link to={clientProjectsPath(clientId)}>{t('common.projects')}</Link>
      </p>
      <h1>{project.name}</h1>
      <p className="text-muted">{project.notes ? project.notes : t('projects.notesEmpty')}</p>
      {canManage ? <ProjectManageForm clientId={clientId} project={project} /> : null}

      <div className="hub-grid hub-grid-2">
        <HubTasks clientId={clientId} projectId={projectId} />
        <HubFiles clientId={clientId} projectId={projectId} />
      </div>
    </main>
  );
}

function HubTasks({ clientId, projectId }: { clientId: string; projectId: string }) {
  const { data, isPending, isError, error, refetch } = useTasks(projectId);
  const { t } = useI18n();

  return (
    <section>
      <h2>{t('common.tasks')}</h2>
      {isPending ? <ListSkeleton label={t('tasks.loading')} rows={3} /> : null}
      {isError ? (
        <Alert>
          <p>{t('tasks.loadError', { message: error instanceof Error ? error.message : '' })}</p>
          <button type="button" onClick={() => void refetch()}>
            {t('common.retry')}
          </button>
        </Alert>
      ) : null}
      {data ? <p>{t('projects.taskCount', { count: data.length })}</p> : null}
      {data && data.length === 0 ? <p>{t('tasks.empty')}</p> : null}
      {data && data.length > 0 ? (
        <ul>
          {data.map((task) => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
      ) : null}
      <p>
        <Link to={projectTasksPath(clientId, projectId)}>{t('projects.viewTasks')}</Link>
      </p>
    </section>
  );
}

function HubFiles({ clientId, projectId }: { clientId: string; projectId: string }) {
  const { data, isPending, isError, error, refetch } = useFiles(projectId);
  const { t } = useI18n();

  return (
    <section>
      <h2>{t('common.files')}</h2>
      {isPending ? <ListSkeleton label={t('files.loading')} rows={3} /> : null}
      {isError ? (
        <Alert>
          <p>{t('files.loadError', { message: error instanceof Error ? error.message : '' })}</p>
          <button type="button" onClick={() => void refetch()}>
            {t('common.retry')}
          </button>
        </Alert>
      ) : null}
      {data ? <p>{t('projects.fileCount', { count: data.length })}</p> : null}
      {data && data.length === 0 ? <p>{t('files.empty')}</p> : null}
      {data && data.length > 0 ? (
        <ul>
          {data.map((file) => (
            <li key={file.id}>{fileLabel(file)}</li>
          ))}
        </ul>
      ) : null}
      <p>
        <Link to={projectFilesPath(clientId, projectId)}>{t('projects.viewFiles')}</Link>
      </p>
    </section>
  );
}
