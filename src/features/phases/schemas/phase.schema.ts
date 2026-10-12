import z from 'zod';

export const phaseStatusSchema = z.enum(['not_started', 'in_progress', 'done']);

export const phaseSchema = z.object({
  id: z.uuid(),
  organization_id: z.uuid(),
  project_id: z.uuid(),
  name: z.string().min(1),
  sort_order: z.int(),
  status: phaseStatusSchema,
  starts_on: z.string().nullable().optional(),
  due_on: z.string().nullable().optional(),
  version: z.int(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const phasesSchema = z.array(phaseSchema);

export const createPhaseSchema = z.object({
  name: z.string().min(1).max(100),
  sort_order: z.int().min(0).optional(),
  starts_on: z.string().nullable().optional(),
  due_on: z.string().nullable().optional(),
});

export const updatePhaseSchema = z.object({
  name: z.string().min(1).max(100),
  sort_order: z.int().min(0),
  status: phaseStatusSchema,
  starts_on: z.string().nullable().optional(),
  due_on: z.string().nullable().optional(),
  version: z.int().min(1),
});

export const DEFAULT_PHASE_NAMES = [
  'Kickoff',
  'Discovery',
  'Design',
  'Development',
  'Content',
  'QA',
  'Launch',
  'Support',
] as const;

export type Phase = z.infer<typeof phaseSchema>;
export type PhaseStatus = z.infer<typeof phaseStatusSchema>;
export type CreatePhaseInput = z.infer<typeof createPhaseSchema>;
export type UpdatePhaseInput = z.infer<typeof updatePhaseSchema>;
