import { http } from '@/lib/api/http';
import { phaseSchema, phasesSchema, type UpdatePhaseInput } from '../schemas/phase.schema';

export const fetchPhases = (projectId: string) =>
  http.get(`/projects/${projectId}/phases`, phasesSchema);

export const fetchPortalPhases = (projectId: string) =>
  http.get(`/client-auth/projects/${projectId}/phases`, phasesSchema);

export const updatePhase = (phaseId: string, input: UpdatePhaseInput) =>
  http.patch(`/phases/${phaseId}`, phaseSchema, input);
