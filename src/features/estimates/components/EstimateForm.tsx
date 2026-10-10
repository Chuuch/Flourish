import {
  Alert,
  Button,
  FieldGrid,
  FormSection,
  SelectField,
  TextArea,
  TextField,
} from '@/components/ui';
import { useClients } from '@/features/clients/hooks/useClients';
import { useI18n } from '@/features/i18n';
import type { EstimateCategory, EstimateInput, EstimateResult } from '../schemas/estimate.schema';
import { defaultEstimateInput } from '../lib/defaults';
import { EstimateResultPanel } from './EstimateResultPanel';
import { BrandingScopeFields } from './scope/BrandingScopeFields';
import { CustomMobileScopeFields } from './scope/CustomMobileScopeFields';
import { CustomWebScopeFields } from './scope/CustomWebScopeFields';
import { DesignScopeFields } from './scope/DesignScopeFields';
import { MarketingScopeFields } from './scope/MarketingScopeFields';
import { WebsiteScopeFields } from './scope/WebsiteScopeFields';

const CATEGORIES: EstimateCategory[] = [
  'website',
  'design',
  'branding',
  'custom_web',
  'custom_mobile',
  'marketing',
];

type EstimateFormProps = {
  value: EstimateInput;
  onChange: (next: EstimateInput) => void;
  clientId: string;
  onClientIdChange: (clientId: string) => void;
  previewResult: EstimateResult | null;
  previewError: string | null;
  saveError: string | null;
  isPreviewing: boolean;
  isSaving: boolean;
  onPreview: () => void;
  onSave: () => void;
};

export function EstimateForm({
  value,
  onChange,
  clientId,
  onClientIdChange,
  previewResult,
  previewError,
  saveError,
  isPreviewing,
  isSaving,
  onPreview,
  onSave,
}: EstimateFormProps) {
  const { t } = useI18n();
  const clients = useClients();
  const clientItems = clients.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <FormSection title={t('estimates.staffOverlays')}>
        <FieldGrid>
          <SelectField
            label={t('estimates.category')}
            value={value.category}
            onChange={(event) => {
              onChange(defaultEstimateInput(event.target.value as EstimateCategory));
            }}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {t(`estimates.category.${category}`)}
              </option>
            ))}
          </SelectField>

          <SelectField
            label={t('estimates.mode')}
            value={value.mode}
            disabled={value.category !== 'marketing'}
            onChange={(event) => {
              onChange({ ...value, mode: event.target.value as EstimateInput['mode'] });
            }}
          >
            <option value="project">{t('estimates.mode.project')}</option>
            <option value="retainer">{t('estimates.mode.retainer')}</option>
          </SelectField>

          <SelectField
            label={t('estimates.complexity')}
            value={value.complexity}
            onChange={(event) => {
              onChange({
                ...value,
                complexity: event.target.value as EstimateInput['complexity'],
              });
            }}
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
            <option value="custom">custom</option>
          </SelectField>

          <SelectField
            label={t('estimates.urgency')}
            value={value.urgency}
            onChange={(event) => {
              onChange({ ...value, urgency: event.target.value as EstimateInput['urgency'] });
            }}
          >
            <option value="normal">normal</option>
            <option value="fast">fast</option>
            <option value="urgent">urgent</option>
          </SelectField>

          <SelectField
            label={t('estimates.client')}
            value={clientId}
            onChange={(event) => {
              onClientIdChange(event.target.value);
            }}
          >
            <option value="">{t('estimates.noClient')}</option>
            {clientItems.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </SelectField>
        </FieldGrid>

        <TextField
          label={t('estimates.projectName')}
          value={value.project_name ?? ''}
          onChange={(event) => {
            onChange({ ...value, project_name: event.target.value });
          }}
        />
        <TextArea
          label={t('estimates.customerNotes')}
          value={value.customer_notes ?? ''}
          onChange={(event) => {
            onChange({ ...value, customer_notes: event.target.value });
          }}
        />
        <TextArea
          label={t('estimates.internalNotes')}
          value={value.internal_notes ?? ''}
          onChange={(event) => {
            onChange({ ...value, internal_notes: event.target.value });
          }}
        />
      </FormSection>

      <FormSection title={t('estimates.scope')}>
        {value.category === 'website' && value.website ? (
          <WebsiteScopeFields
            value={value.website}
            onChange={(website) => {
              onChange({ ...value, website });
            }}
          />
        ) : null}
        {value.category === 'design' && value.design ? (
          <DesignScopeFields
            value={value.design}
            onChange={(design) => {
              onChange({ ...value, design });
            }}
          />
        ) : null}
        {value.category === 'branding' && value.branding ? (
          <BrandingScopeFields
            value={value.branding}
            onChange={(branding) => {
              onChange({ ...value, branding });
            }}
          />
        ) : null}
        {value.category === 'custom_web' && value.custom_web ? (
          <CustomWebScopeFields
            value={value.custom_web}
            onChange={(custom_web) => {
              onChange({ ...value, custom_web });
            }}
          />
        ) : null}
        {value.category === 'custom_mobile' && value.custom_mobile ? (
          <CustomMobileScopeFields
            value={value.custom_mobile}
            onChange={(custom_mobile) => {
              onChange({ ...value, custom_mobile });
            }}
          />
        ) : null}
        {value.category === 'marketing' && value.marketing ? (
          <MarketingScopeFields
            value={value.marketing}
            onChange={(marketing) => {
              onChange({ ...value, marketing });
            }}
          />
        ) : null}
      </FormSection>

      {previewError ? <Alert>{previewError}</Alert> : null}
      {saveError ? <Alert>{saveError}</Alert> : null}
      {previewResult ? <EstimateResultPanel result={previewResult} /> : null}

      <div className="form-actions">
        <Button type="button" variant="ghost" disabled={isPreviewing} onClick={onPreview}>
          {t('estimates.preview')}
        </Button>
        <Button type="button" disabled={isSaving} onClick={onSave}>
          {t('estimates.save')}
        </Button>
      </div>
    </div>
  );
}
