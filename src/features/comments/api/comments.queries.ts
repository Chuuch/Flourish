import { queryOptions } from '@tanstack/react-query';
import { fetchComments } from './comments.api';

export const commentKeys = {
  all: ['comments'] as const,
  lists: (taskId: string) => [...commentKeys.all, 'list', taskId] as const,
};

export const commentsQueries = {
  list: (taskId: string) =>
    queryOptions({
      queryKey: commentKeys.lists(taskId),
      queryFn: () => fetchComments(taskId),
    }),
};
