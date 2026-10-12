import { http } from '@/lib/api/http';
import { withIdempotencyKey } from '@/lib/api/idempotency';
import {
  DEFAULT_PHASE_NAMES,
  phaseSchema,
  phasesSchema,
  type CreatePhaseInput,
  type UpdatePhaseInput,
} from '../schemas/phase.schema';

export const fetchPhases = (projectId: string) =>
  http.get(`/projects/${projectId}/phases`, phasesSchema);

export const fetchPortalPhases = (projectId: string) =>
  http.get(`/client-auth/projects/${projectId}/phases`, phasesSchema);

export const createPhase = (projectId: string, input: CreatePhaseInput) =>
  http.post(`/projects/${projectId}/phases`, phaseSchema, input, withIdempotencyKey());

export const updatePhase = (phaseId: string, input: UpdatePhaseInput) =>
  http.patch(`/phases/${phaseId}`, phaseSchema, input);

export async function seedDefaultPhases(projectId: string) {
  for (const [index, name] of DEFAULT_PHASE_NAMES.entries()) {
    await createPhase(projectId, { name, sort_order: index });
  }
}
