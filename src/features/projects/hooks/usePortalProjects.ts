import { useInfiniteQuery } from '@tanstack/react-query';
import { portalProjectsQueries } from '../api/projects.queries';

export function usePortalProjects(q = '') {
  return useInfiniteQuery(portalProjectsQueries.list(q));
}
