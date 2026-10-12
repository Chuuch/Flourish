import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { Alert, Button } from '@/components/ui';
import { useI18n } from '@/features/i18n';
import { PhaseProgressStrip } from './PhaseProgressStrip';
import { usePhases } from '../hooks/usePhases';
import { useAuthStore } from '@/features/auth';
import { canManageProjects } from '@/features/projects/schemas/project.schema';
import { useQueryClient } from '@tanstack/react-query';
import { useUpdatePhase } from '../hooks/useUpdatePhase';
import { useState } from 'react';
import { advancePhaseStatuses, updateInputFromPhase } from '../lib/advancePhase';
import { updatePhase } from '../api/phases.api';
import { phaseKeys } from '../api/phases.queries';

export function ProjectPhaseProgress({ projectId }: { projectId: string }) {
  const { t } = useI18n();
  const role = useAuthStore((state) => state.role);
  const canManage = canManageProjects(role);
  const queryClient = useQueryClient();
  const { data, isPending, isError, error, refetch } = usePhases(projectId);
  const update = useUpdatePhase(projectId);
  const [advancing, setAdvancing] = useState(false);

  if (isPending) {
    return <ListSkeleton label={t('phases.loading')} />;
  }

  if (isError) {
    const message = error instanceof Error ? error.message : '';
    return (
      <Alert>
        <p>{t('phases.loadError', { message })}</p>
        <Button type="button" variant="ghost" size="sm" onClick={() => void refetch()}>
          {t('common.retry')}
        </Button>
      </Alert>
    );
  }

  if (!data.length) {
    return <p className="text-muted text-sm">{t('phases.empty')}</p>;
  }

  return (
    <section className="flex flex-col gap-3" aria-labelledby="project-phases-heading">
      <h2 id="project-phases-heading" className="text-sm font-semibold tracking-tight">
        {t('phases.title')}
      </h2>
      <PhaseProgressStrip
        phases={data}
        interactive={canManage}
        disabled={advancing || update.isPending}
        onSelect={(phaseId) => {
          void (async () => {
            setAdvancing(true);
            try {
              const targets = advancePhaseStatuses(data, phaseId);
              let working = [...data].sort((a, b) => a.sort_order - b.sort_order);

              for (const target of targets) {
                const current = working.find((phase) => phase.id === target.id);
                if (!current || current.status === target.status) {
                  continue;
                }

                const updated = await updatePhase(
                  target.id,
                  updateInputFromPhase({ ...current, status: target.status }),
                );
                working = working.map((phase) => (phase.id === updated.id ? updated : phase));
              }

              await queryClient.invalidateQueries({ queryKey: phaseKeys.project(projectId) });
            } finally {
              setAdvancing(false);
            }
          })();
        }}
      />
      {canManage ? <p className="text-muted text-xs">{t('phases.hint')}</p> : null}
    </section>
  );
}
