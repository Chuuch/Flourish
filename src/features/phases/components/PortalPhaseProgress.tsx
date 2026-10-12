import { Alert, Button } from '@/components/ui';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { useI18n } from '@/features/i18n';
import { usePortalProjects } from '@/features/projects/hooks/usePortalProjects';
import { usePortalPhases } from '../hooks/usePhases';
import { PhaseProgressStrip } from './PhaseProgressStrip';

function PortalProjectPhases({
  projectId,
  projectName,
}: {
  projectId: string;
  projectName: string;
}) {
  const { t } = useI18n();
  const { data, isPending, isError, error, refetch } = usePortalPhases(projectId);

  if (isPending) {
    return <ListSkeleton label={t('phases.loading')} />;
  }

  if (isError) {
    return (
      <Alert>
        <p>{t('phases.loadError', { message: error instanceof Error ? error.message : '' })}</p>
        <Button type="button" variant="ghost" size="sm" onClick={() => void refetch()}>
          {t('common.retry')}
        </Button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="m-0 text-sm font-semibold tracking-tight">{projectName}</h3>
      <PhaseProgressStrip phases={data} />
    </div>
  );
}

export function PortalPhaseProgress() {
  const { t } = useI18n();
  const { data, isPending, isError, error, refetch } = usePortalProjects();

  if (isPending) {
    return <ListSkeleton label={t('phases.loading')} />;
  }

  if (isError) {
    return (
      <Alert>
        <p>{t('phases.loadError', { message: error instanceof Error ? error.message : '' })}</p>
        <Button type="button" variant="ghost" size="sm" onClick={() => void refetch()}>
          {t('common.retry')}
        </Button>
      </Alert>
    );
  }

  const projects = data.pages.flatMap((page) => page.items);

  if (projects.length === 0) {
    return <p className="text-muted m-0 text-sm">{t('phases.portalEmpty')}</p>;
  }

  return (
    <section className="flex flex-col gap-5" aria-labelledby="portal-phases-heading">
      <h2 id="portal-phases-heading" className="m-0 text-base font-semibold tracking-tight">
        {t('phases.title')}
      </h2>
      {projects.map((project) => (
        <PortalProjectPhases key={project.id} projectId={project.id} projectName={project.name} />
      ))}
    </section>
  );
}
