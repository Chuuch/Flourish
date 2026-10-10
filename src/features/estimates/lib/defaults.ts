import type { EstimateCategory, EstimateInput } from '../schemas/estimate.schema';

const websiteDefaults = {
  website_type: 'corporate' as const,
  page_count: 5,
  multilingual: false,
  cms_required: true,
  content_ready: true,
  seo_setup: false,
  uiux_included: false,
  branding_included: false,
  expected_revisions: 'medium' as const,
  integrations: [] as string[],
};

const designDefaults = {
  deliverables: ['hi_fi'] as string[],
  screen_count: 8,
  brand_guidelines_exist: true,
  includes_mobile: true,
  includes_desktop: true,
  design_size: 'medium' as const,
  expected_revisions: 'medium' as const,
};

const brandingDefaults = {
  package: 'identity' as const,
  deliverables: ['palette', 'typography'] as string[],
  has_existing_brand: false,
  competitor_research: false,
  stakeholder_count: '1-2' as const,
  expected_revisions: 'medium' as const,
};

const customWebDefaults = {
  platforms: ['app'] as string[],
  auth: 'email' as const,
  roles_permissions: false,
  payments: 'none' as const,
  integrations: [] as string[],
  realtime: false,
  file_uploads: false,
  multilingual: false,
  design_included: true,
  content_ready: true,
  app_scale: 'mvp' as const,
  expected_revisions: 'medium' as const,
  hosting_devops: 'basic' as const,
};

const customMobileDefaults = {
  platforms: ['both'] as string[],
  backend: 'existing' as const,
  auth: 'email' as const,
  offline: false,
  push_notifications: true,
  payments_in_app: false,
  store_release: true,
  design_included: true,
  device_features: [] as string[],
  content_ready: true,
  app_scale: 'mvp' as const,
  expected_revisions: 'medium' as const,
};

const marketingDetails = {
  channels: ['meta', 'google'] as string[],
  creatives_per_month: 8,
  creatives_one_shot: 0,
  reporting_level: 'standard' as const,
  campaign_complexity: 'medium' as const,
  landing_page_support: false,
  ad_spend_band: 'medium' as const,
  campaign_goal: 'leads',
  duration_weeks: 8,
  setup_includes: [] as string[],
};

export function defaultEstimateInput(category: EstimateCategory = 'website'): EstimateInput {
  const base: EstimateInput = {
    category,
    mode: category === 'marketing' ? 'retainer' : 'project',
    complexity: 'medium',
    urgency: 'normal',
    project_name: '',
    customer_notes: '',
    internal_notes: '',
  };

  switch (category) {
    case 'website':
      return { ...base, website: { ...websiteDefaults } };
    case 'design':
      return { ...base, design: { ...designDefaults } };
    case 'branding':
      return { ...base, branding: { ...brandingDefaults } };
    case 'custom_web':
      return { ...base, custom_web: { ...customWebDefaults } };
    case 'custom_mobile':
      return { ...base, custom_mobile: { ...customMobileDefaults } };
    case 'marketing':
      return { ...base, mode: 'retainer', marketing: { ...marketingDetails } };
  }
}

export function sanitizeEstimateInput(input: EstimateInput): EstimateInput {
  const next: EstimateInput = {
    category: input.category,
    mode: input.category === 'marketing' ? input.mode : 'project',
    complexity: input.complexity,
    urgency: input.urgency,
    ...(input.project_name ? { project_name: input.project_name } : {}),
    ...(input.respondent_name ? { respondent_name: input.respondent_name } : {}),
    ...(input.company_name ? { company_name: input.company_name } : {}),
    ...(input.customer_notes ? { customer_notes: input.customer_notes } : {}),
    ...(input.internal_notes ? { internal_notes: input.internal_notes } : {}),
  };

  switch (input.category) {
    case 'website':
      next.website = input.website ?? defaultEstimateInput('website').website;
      break;
    case 'design':
      next.design = input.design ?? defaultEstimateInput('design').design;
      break;
    case 'branding':
      next.branding = input.branding ?? defaultEstimateInput('branding').branding;
      break;
    case 'custom_web':
      next.custom_web = input.custom_web ?? defaultEstimateInput('custom_web').custom_web;
      break;
    case 'custom_mobile':
      next.custom_mobile =
        input.custom_mobile ?? defaultEstimateInput('custom_mobile').custom_mobile;
      break;
    case 'marketing':
      next.marketing = input.marketing ?? defaultEstimateInput('marketing').marketing;
      break;
  }

  return next;
}
