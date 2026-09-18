import { clientProjectsPath, paths, projectTasksPath } from '@/app/router/paths';
import { Link, useParams } from 'react-router';
import { CreateCommentForm } from '../components/CreateCommentForm';
import { CommentList } from '../components/CommentList';

export function CommentsPage() {
  const { clientId, projectId, taskId } = useParams();

  if (!clientId || !projectId || !taskId) {
    return (
      <main>
        <h1>Comments</h1>
        <p>Task not found.</p>
      </main>
    );
  }

  return (
    <main>
      <p>
        <Link to={paths.clients}>Clients</Link>
        {' / '}
        <Link to={clientProjectsPath(clientId)}>Projects</Link>
        {' / '}
        <Link to={projectTasksPath(clientId, projectId)}>Tasks</Link>
      </p>
      <h1>Comments</h1>
      <CreateCommentForm taskId={taskId} />
      <CommentList taskId={taskId} />
    </main>
  );
}
