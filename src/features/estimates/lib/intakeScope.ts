import type { EstimateCategory, EstimateMode } from '../schemas/estimate.schema';
import type { IntakeScope } from '../schemas/intake.schema';
import { defaultEstimateInput } from './defaults';

export function defaultIntakeScope(category: EstimateCategory): IntakeScope {
  const input = defaultEstimateInput(category);
  return {
    website: input.website,
    design: input.design,
    branding: input.branding,
    custom_web: input.custom_web,
    custom_mobile: input.custom_mobile,
    marketing: input.marketing,
  };
}

export function defaultModeForCategory(category: EstimateCategory): EstimateMode {
  return category === 'marketing' ? 'retainer' : 'project';
}
