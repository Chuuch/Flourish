import { estimatePath, paths } from '@/app/router/paths';
import { Alert, Button } from '@/components/ui';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { useI18n } from '@/features/i18n';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { EstimateForm } from '../components/EstimateForm';
import { useCreateEstimate } from '../hooks/useCreateEstimate';
import { useIntake } from '../hooks/useIntake';
import { usePreviewEstimate } from '../hooks/usePreviewEstimate';
import {
  defaultEstimateInput,
  estimateInputFromIntake,
  sanitizeEstimateInput,
} from '../lib/defaults';
import type { EstimateInput, EstimateResult } from '../schemas/estimate.schema';

export function EstimateWorkspacePage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const intakeId = searchParams.get('intakeId')?.trim() ?? '';
  const intakeQuery = useIntake(intakeId);
  const preview = usePreviewEstimate();
  const create = useCreateEstimate();
  const [input, setInput] = useState<EstimateInput>(() => defaultEstimateInput('website'));
  const [clientId, setClientId] = useState('');
  const [previewResult, setPreviewResult] = useState<EstimateResult | null>(null);
  const [hydratedFromIntake, setHydratedFromIntake] = useState(intakeId.length === 0);

  useEffect(() => {
    if (!intakeId || !intakeQuery.data) {
      return;
    }
    setInput(estimateInputFromIntake(intakeQuery.data));
    setPreviewResult(null);
    setHydratedFromIntake(true);
  }, [intakeId, intakeQuery.data]);

  if (intakeId && (intakeQuery.isPending || !hydratedFromIntake)) {
    return (
      <main>
        <ListSkeleton label={t('estimates.loading')} />
      </main>
    );
  }

  if (intakeId && intakeQuery.isError) {
    return (
      <main>
        <Alert>
          <p>
            {intakeQuery.error instanceof Error
              ? intakeQuery.error.message
              : t('intake.loadError', { message: 'unknown' })}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              void intakeQuery.refetch();
            }}
          >
            {t('common.retry')}
          </Button>
        </Alert>
      </main>
    );
  }

  return (
    <main>
      <p className="breadcrumb">
        <Link to={paths.estimates}>{t('estimates.title')}</Link>
        <span aria-hidden="true">/</span>
        <span>{t('estimates.new')}</span>
      </p>
      <div className="page-header">
        <h1>{t('estimates.workspaceTitle')}</h1>
        {intakeId ? (
          <p className="text-muted m-0 text-sm">
            {t(`estimates.category.${input.category}`)} · intake
          </p>
        ) : null}
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
