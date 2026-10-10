import z from 'zod';

export const estimateCategorySchema = z.enum([
  'website',
  'design',
  'branding',
  'custom_web',
  'custom_mobile',
  'marketing',
]);

export const estimateModeSchema = z.enum(['project', 'retainer']);
export const complexitySchema = z.enum(['low', 'medium', 'high', 'custom']);
export const urgencySchema = z.enum(['normal', 'fast', 'urgent']);
export const riskLevelSchema = z.enum(['low', 'moderate', 'high']);

export const webisteInputSchema = z.object({
  website_type: z.enum(['landing', 'corporate', 'ecommerce']),
  page_count: z.int().min(1),
  multilingual: z.boolean(),
  cms_required: z.boolean(),
  content_ready: z.boolean(),
  seo_setup: z.boolean(),
  uiux_included: z.boolean(),
  branding_included: z.boolean(),
  expected_revisions: z.enum(['low', 'medium', 'high']),
  integrations: z.array(z.string()),
});

export const designInputSchema = z.object({
  deliverables: z.array(z.string()),
  screen_count: z.int().min(0),
  brand_guidelines_exist: z.boolean(),
  includes_mobile: z.boolean(),
  includes_desktop: z.boolean(),
  design_size: z.enum(['small', 'medium', 'large']),
  expected_revisions: z.enum(['low', 'medium', 'high']),
});

export const brandingInputSchema = z.object({
  package: z.enum(['logo', 'identity', 'full']),
  deliverables: z.array(z.string()),
  has_existing_brand: z.boolean(),
  competitor_research: z.boolean(),
  stakeholder_count: z.enum(['1-2', '3-5', '6+']),
  expected_revisions: z.enum(['low,', 'medium', 'high']),
});

export const customWebInputSchema = z.object({
  platforms: z.array(z.string()),
  auth: z.enum(['none', 'email', 'sso', 'both']),
  roles_permissions: z.boolean(),
  payments: z.enum(['none', 'one_time', 'subscriptions', 'marketplace']),
  integrations: z.array(z.string()),
  realtime: z.boolean(),
  file_uploads: z.boolean(),
  multilingual: z.boolean(),
  design_included: z.boolean(),
  content_ready: z.boolean(),
  app_scale: z.enum(['mvp', 'growth', 'complex']),
  expected_revisions: z.enum(['low', 'medium', 'high']),
  hosting_devops: z.enum(['none', 'basic', 'cicd']),
});

export const customMobileInput = z.object({
  platforms: z.array(z.string()),
  backend: z.enum(['none', 'existing', 'new']),
  auth: z.enum(['none', 'email', 'sso', 'both']),
  offline: z.boolean(),
  push_notifications: z.boolean(),
  payments_in_app: z.boolean(),
  store_release: z.boolean(),
  design_included: z.boolean(),
  device_features: z.array(z.string()),
  content_ready: z.boolean(),
  app_scale: z.enum(['mvp', 'growh', 'complex']),
  expected_revisions: z.enum(['low', 'medium', 'high']),
});

export const marketingInputSchema = z.object({
  channels: z.array(z.string()),
  creatives_per_month: z.int().min(0),
  creatives_one_shot: z.int().min(0),
  reporting_level: z.enum(['basic', 'standard', 'advanced']),
  campaign_complexity: z.enum(['low', 'medium', 'high']),
  landing_page_support: z.boolean(),
  ad_spend_band: z.enum(['low', 'medium', 'high']),
  campaign_goal: z.string(),
  duration_weeks: z.int().min(0),
  setup_includes: z.array(z.string()),
});

export const estimateInputSchema = z.object({
  category: estimateCategorySchema,
  mode: estimateModeSchema,
  complexity: complexitySchema,
  urgency: urgencySchema,
  project_name: z.string().optional(),
  respondent_name: z.string().optional(),
  company_name: z.string().optional(),
  customer_notes: z.string().optional(),
  internal_notes: z.string().optional(),

  website: webisteInputSchema.optional(),
  design: designInputSchema.optional(),
  branding: brandingInputSchema.optional(),
  custom_web: customWebInputSchema.optional(),
  custom_mobile: customMobileInput.optional(),
  marketing: marketingInputSchema.optional(),
});

export const estimateResultSchema = z.object({
  catalog_version: z.string(),
  currency: z.string(),
  estimated_hours: z.number().nullable().optional(),
  hours_per_month: z.number().nullable().optional(),
  estimated_timeline_days: z.int().nullable().optional(),
  internal_base_rate_cents: z.int(),
  target_rate_cents: z.int(),
  minimum_price_cents: z.int(),
  recommended_price_cents: z.int(),
  eur_per_hour: z.number(),
  risk_level: riskLevelSchema,
  drivers: z.array(z.string()),
  expensive_factors: z.array(z.string()),
  risk_factors: z.array(z.string()),
});

export const catalogSchema = z.object({
  id: z.uuid(),
  version: z.string(),
  currency: z.string(),
  floor_cents_per_hour: z.int(),
  target_cents_per_hour: z.int(),
  target_multiplier_bps: z.int(),
});

export const previewResponseSchema = z.object({
  catalog: catalogSchema,
  result: estimateResultSchema,
});

export const estimateSchema = z.object({
  id: z.uuid(),
  orgnaization_id: z.uuid(),
  created_by_user_id: z.uuid(),
  client_id: z.uuid().nullable().optional(),
  category: estimateCategorySchema,
  mode: estimateModeSchema,
  catalog_version_id: z.uuid(),
  currency: z.string(),
  input: estimateInputSchema,
  result: estimateResultSchema,
  estimated_hours: z.number().nullable().optional(),
  estimated_timeline_days: z.int().nullable().optional(),
  hours_per_month: z.number().nullable().optional(),
  minimum_price_cents: z.number().int(),
  recommended_price_cents: z.number().int(),
  risk_level: riskLevelSchema,
  created_at: z.string(),
});

export const estimatesPageSchema = z.object({
  items: z.array(estimateSchema),
  next_cursor: z.string().nullable(),
});

export const createEstimateBodySchema = z.object({
  client_id: z.uuid().nullable().optional(),
  input: estimateInputSchema,
});

export const createProjectFromEstimateSchema = z.object({
  client_id: z.uuid(),
  name: z.string().min(4).max(100),
  notes: z.string().max(2000).default(''),
});

export type EstimateCategory = z.infer<typeof estimateCategorySchema>;
export type EstimateMode = z.infer<typeof estimateModeSchema>;
export type EstimateInput = z.infer<typeof estimateInputSchema>;
export type EstimateResult = z.infer<typeof estimateResultSchema>;
export type Estimate = z.infer<typeof estimateSchema>;
export type PreviewRespose = z.infer<typeof previewResponseSchema>;
export type Catalog = z.infer<typeof catalogSchema>;
export type CreateEstimateBody = z.infer<typeof createEstimateBodySchema>;
export type CreateProjectFromEstimateInput = z.infer<typeof createProjectFromEstimateSchema>;
