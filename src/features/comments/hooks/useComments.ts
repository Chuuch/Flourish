import { useQuery } from '@tanstack/react-query';
import { commentsQueries } from '../api/comments.queries';

export function useComments(taskId: string) {
  return useQuery(commentsQueries.list(taskId));
}
