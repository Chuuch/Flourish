import z from 'zod';
import {
  brandingInputSchema,
  customMobileInputSchema,
  customWebInputSchema,
  designInputSchema,
  estimateCategorySchema,
  estimateModeSchema,
  marketingInputSchema,
  webisteInputSchema,
} from './estimate.schema';

export const intakeStatusSchema = z.enum(['pending', 'submitted', 'consumed', 'expired']);

export const intakeScopeSchema = z.object({
  project_name: z.string().optional(),
  respondent_name: z.string().optional(),
  company_name: z.string().optional(),
  customer_notes: z.string().optional(),
  preferred_deadline: z.string().optional(),
  website: webisteInputSchema.optional(),
  design: designInputSchema.optional(),
  branding: brandingInputSchema.optional(),
  custom_web: customWebInputSchema.optional(),
  custom_mobile: customMobileInputSchema.optional(),
  marketing: marketingInputSchema.optional(),
});

export const publicIntakeSchema = z.object({
  category: estimateCategorySchema,
  mode: estimateModeSchema,
  status: intakeStatusSchema,
  expires_at: z.string(),
});

export const intakeSchema = z.object({
  id: z.uuid(),
  organization_id: z.uuid(),
  created_by_user_id: z.uuid(),
  category: estimateCategorySchema,
  mode: estimateModeSchema,
  status: intakeStatusSchema,
  expires_at: z.string(),
  respondent_email: z.email().nullable().optional(),
  respondent_name: z.string().nullable().optional(),
  company_name: z.string().nullable().optional(),
  project_name: z.string().nullable().optional(),
  preferred_deadline: z.string().nullable().optional(),
  client_id: z.uuid().nullable().optional(),
  scope: intakeScopeSchema.nullable().optional(),
  submitted_at: z.string().nullable().optional(),
  created_at: z.string(),
});

export const intakesPageSchema = z.object({
  items: z.array(intakeSchema),
  next_cursor: z.string().nullable(),
});

export const createIntakeBodySchema = z.object({
  category: estimateCategorySchema,
  mode: estimateModeSchema,
  respondent_email: z.email(),
  respondent_name: z.string().max(200).optional(),
});

export const createIntakeResponseSchema = z.object({
  intake: intakeSchema,
  token: z.string().min(1),
  url: z.url().min(1),
});

export const submitIntakeBodySchema = z.object({
  respondent_email: z.email(),
  respondent_name: z.string().min(1).max(200),
  company_name: z.string().max(200).optional().default(''),
  project_name: z.string().min(1).max(200),
  customer_notes: z.string().max(4000).optional().default(''),
  preferred_deadline: z.string().optional().default(''),
  scope: intakeScopeSchema,
});

export type PublicIntake = z.infer<typeof publicIntakeSchema>;
export type Intake = z.infer<typeof intakeSchema>;
export type IntakeScope = z.infer<typeof intakeScopeSchema>;
export type CreateIntakeBody = z.infer<typeof createIntakeBodySchema>;
export type CreateIntakeResponse = z.infer<typeof createIntakeResponseSchema>;
export type SubmitIntakeBody = z.infer<typeof submitIntakeBodySchema>;
