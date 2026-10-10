import { estimatePath, paths } from '@/app/router/paths';
import { useI18n } from '@/features/i18n';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { EstimateForm } from '../components/EstimateForm';
import { useCreateEstimate } from '../hooks/useCreateEstimate';
import { usePreviewEstimate } from '../hooks/usePreviewEstimate';
import { defaultEstimateInput, sanitizeEstimateInput } from '../lib/defaults';
import type { EstimateInput, EstimateResult } from '../schemas/estimate.schema';

export function EstimateWorkspacePage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const preview = usePreviewEstimate();
  const create = useCreateEstimate();
  const [input, setInput] = useState<EstimateInput>(() => defaultEstimateInput('website'));
  const [clientId, setClientId] = useState('');
  const [previewResult, setPreviewResult] = useState<EstimateResult | null>(null);

  return (
    <main>
      <p className="breadcrumb">
        <Link to={paths.estimates}>{t('estimates.title')}</Link>
        <span aria-hidden="true">/</span>
        <span>{t('estimates.new')}</span>
      </p>
      <div className="page-header">
        <h1>{t('estimates.workspaceTitle')}</h1>
      </div>

      <EstimateForm
        value={input}
        onChange={(next) => {
          setInput(next);
          setPreviewResult(null);
        }}
        clientId={clientId}
        onClientIdChange={setClientId}
        previewResult={previewResult}
        previewError={preview.isError ? preview.error.message : null}
        saveError={create.isError ? create.error.message : null}
        isPreviewing={preview.isPending}
        isSaving={create.isPending}
        onPreview={() => {
          const body = sanitizeEstimateInput(input);
          preview.mutate(body, {
            onSuccess: (response) => {
              setPreviewResult(response.result);
            },
          });
        }}
        onSave={() => {
          const body = sanitizeEstimateInput(input);
          create.mutate(
            {
              input: body,
              ...(clientId ? { client_id: clientId } : { client_id: null }),
            },
            {
              onSuccess: (estimate) => {
                void navigate(estimatePath(estimate.id));
              },
            },
          );
        }}
      />
    </main>
  );
}
