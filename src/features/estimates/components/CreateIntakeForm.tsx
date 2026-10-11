import { useI18n } from '@/features/i18n';
import type { EstimateCategory, EstimateMode } from '../schemas/estimate.schema';
import { useCreateIntake } from '../hooks/useCreateIntake';
import { useState } from 'react';
import { Alert, Button, FieldGrid, FormSection, SelectField, TextField } from '@/components/ui';
import { defaultModeForCategory } from '../lib/intakeScope';

const CATEGORIES: EstimateCategory[] = [
  'website',
  'design',
  'branding',
  'custom_web',
  'custom_mobile',
  'marketing',
];

export function CreateIntakeForm() {
  const { t } = useI18n();
  const create = useCreateIntake();
  const [category, setCategory] = useState<EstimateCategory>('custom_mobile');
  const [mode, setMode] = useState<EstimateMode>('project');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [lastUrl, setLastUrl] = useState<string | null>(null);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        create.mutate(
          {
            category,
            mode: category === 'marketing' ? mode : 'project',
            respondent_email: email.trim(),
            ...(name.trim() ? { respondent_name: name.trim() } : {}),
          },
          {
            onSuccess: (response) => {
              setLastUrl(response.url);
              setEmail('');
              setName('');
            },
          },
        );
      }}
      noValidate
    >
      <FormSection title={t('intake.sendTitle')} description={t('intake.sendBody')}>
        <FieldGrid>
          <TextField
            label={t('intake.email')}
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <TextField
            label={t('intake.name')}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <SelectField
            label={t('estimates.category')}
            value={category}
            onChange={(e) => {
              const next = e.target.value as EstimateCategory;
              setCategory(next);
              setMode(defaultModeForCategory(next));
            }}
          >
            {CATEGORIES.map((value) => (
              <option key={value} value={value}>
                {t(`estimates.category.${value}`)}
              </option>
            ))}
          </SelectField>
          <SelectField
            label={t('estimates.mode')}
            value={mode}
            disabled={category !== 'marketing'}
            onChange={(e) => {
              setMode(e.target.value as EstimateMode);
            }}
          >
            <option value="project">{t('estimates.mode.project')}</option>
            <option value="retainer">{t('estimates.mode.retainer')}</option>
          </SelectField>
        </FieldGrid>

        {create.isError ? (
          <Alert>{create.error instanceof Error ? create.error.message : t('toast.failed')}</Alert>
        ) : null}

        {lastUrl ? (
          <p className="text-muted m-0 text-sm break-all">
            {t('intake.linkCopiedHint')}: {lastUrl}
          </p>
        ) : null}

        <div className="form-actions">
          <Button type="submit" disabled={create.isPending || !email.trim()}>
            {t('intake.send')}
          </Button>
        </div>
      </FormSection>
    </form>
  );
}
