import { useTasks } from './useTasks';

export function useTask(projectId: string, taskId: string) {
  const { data, isPending, isError, error, refetch } = useTasks(projectId);
  const task = data?.pages.flatMap((page) => page.items).find((item) => item.id === taskId);

  return { task, isPending, isError, error, refetch };
}
