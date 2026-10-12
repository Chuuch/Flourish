import { clientProjectsPath, paths, projectTasksPath, taskPath } from '@/app/router/paths';
import { ClientCrumb } from '@/features/clients/components/ClientCrumb';
import { useI18n } from '@/features/i18n';
import { ProjectCrumb } from '@/features/projects/components/ProjectCrumb';
import { Link, useParams } from 'react-router';
import { CreateCommentForm } from '../components/CreateCommentForm';
import { CommentList } from '../components/CommentList';

export function CommentsPage() {
  const { clientId, projectId, taskid, taskId: taskIdParam } = useParams();
  const taskId = taskid ?? taskIdParam;
  const { t } = useI18n();

  if (!clientId || !projectId || !taskId) {
    return (
      <main>
        <h1>{t('comments.title')}</h1>
        <p>{t('comments.empty')}</p>
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
        {' / '}
        <Link to={projectTasksPath(clientId, projectId)}>{t('common.tasks')}</Link>
        {' / '}
        <Link to={taskPath(clientId, projectId, taskId)}>{t('tasks.hubCrumb')}</Link>
      </p>
      <h1>{t('comments.title')}</h1>
      <CreateCommentForm taskId={taskId} />
      <CommentList taskId={taskId} />
    </main>
  );
}
