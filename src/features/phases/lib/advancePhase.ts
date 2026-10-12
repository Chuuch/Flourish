import type { Phase, PhaseStatus, UpdatePhaseInput } from '../schemas/phase.schema';

export function advancePhaseStatuses(phases: Phase[], targetPhaseId: string): Phase[] {
  const ordered = [...phases].sort((a, b) => a.sort_order - b.sort_order);
  const targetIndex = ordered.findIndex((phase) => phase.id === targetPhaseId);
  if (targetIndex < 0) {
    return ordered;
  }

  return ordered.map((phase, index) => {
    let status: PhaseStatus;
    if (index < targetIndex) {
      status = 'done';
    } else if (index === targetIndex) {
      status = 'in_progress';
    } else {
      status = 'not_started';
    }
    return { ...phase, status };
  });
}

export function updateInputFromPhase(phase: Phase): UpdatePhaseInput {
  return {
    name: phase.name,
    sort_order: phase.sort_order,
    status: phase.status,
    starts_on: phase.starts_on ?? null,
    due_on: phase.due_on ?? null,
    version: phase.version,
  };
}
