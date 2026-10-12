import { useQuery } from '@tanstack/react-query';
import { phasesQueries } from '../api/phases.queries';

export function usePhases(projectId: string) {
  return useQuery(phasesQueries.project(projectId));
}

export function usePortalPhases(projectId: string) {
  return useQuery(phasesQueries.portalProject(projectId));
}
