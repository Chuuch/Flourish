import { queryOptions } from '@tanstack/react-query';
import { fetchPhases, fetchPortalPhases } from './phases.api';

export const phaseKeys = {
  all: ['phases'] as const,
  project: (projectId: string) => [...phaseKeys.all, 'project', projectId] as const,
  portalProject: (projectId: string) => [...phaseKeys.all, 'portal', projectId] as const,
};

export const phasesQueries = {
  project: (projectId: string) =>
    queryOptions({
      queryKey: phaseKeys.project(projectId),
      queryFn: () => fetchPhases(projectId),
    }),
  portalProject: (projectId: string) =>
    queryOptions({
      queryKey: phaseKeys.portalProject(projectId),
      queryFn: () => fetchPortalPhases(projectId),
    }),
};
