import { Alert, Button, FieldGrid, TextField } from '@/components/ui';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { useI18n } from '@/features/i18n';
import { memberLabel } from '@/features/members/schemas/member.schema';
import { useTimeReport } from '../hooks/useTimeReport';
import { reportRange } from '../lib/reportRange';

interface ReportListProps {
  fromDate: string;
  toDate: string;
  onRangeChange: (fromDate: string, toDate: string) => void;
}

export function ReportList({ fromDate, toDate, onRangeChange }: ReportListProps) {
  const range = reportRange(fromDate, toDate);
  const { data, isPending, isError, error, refetch } = useTimeReport(range.from, range.to);
  const { t } = useI18n();

  return (
    <>
      <form
        className="panel-card"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const from = form.get('from');
          const to = form.get('to');
          if (typeof from !== 'string' || typeof to !== 'string') {
            return;
          }
          onRangeChange(from, to);
        }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <FieldGrid>
              <TextField
                name="from"
                type="date"
                label={t('reports.from')}
                defaultValue={fromDate}
                required
              />
              <TextField
                name="to"
                type="date"
                label={t('reports.to')}
                defaultValue={toDate}
                required
              />
            </FieldGrid>
          </div>
          <div className="form-actions sm:pb-0.5">
            <Button type="submit">{t('reports.apply')}</Button>
          </div>
        </div>
      </form>

      {isPending ? <ListSkeleton label={t('reports.loading')} /> : null}

      {isError ? (
        <Alert>
          <p>
            {t('reports.loadError', {
              message: error instanceof Error ? error.message : '',
            })}
          </p>
          <Button type="button" variant="ghost" size="sm" onClick={() => void refetch()}>
            {t('common.retry')}
          </Button>
        </Alert>
      ) : null}

      {data ? (
        <p className="stat-pill m-0" data-tone="accent">
          {t('reports.total', { minutes: data.total_minutes })}
        </p>
      ) : null}

      {data && data.total_minutes === 0 ? (
        <p className="text-muted m-0 text-sm">{t('reports.empty')}</p>
      ) : null}

      {data && data.total_minutes > 0 ? (
        <div className="page-grid page-grid-3">
          <section className="flex flex-col gap-2">
            <h2 className="m-0 text-sm font-semibold tracking-tight">{t('reports.byClient')}</h2>
            <ul className="stack-list">
              {data.by_client.map((row) => (
                <li key={row.client_id}>
                  <div className="row-split">
                    <span className="text-sm font-medium">{row.client_name}</span>
                    <span>{t('reports.total', { minutes: row.minutes })}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section className="flex flex-col gap-2">
            <h2 className="m-0 text-sm font-semibold tracking-tight">{t('reports.byProject')}</h2>
            <ul className="stack-list">
              {data.by_project.map((row) => (
                <li key={row.project_id}>
                  <div className="row-split">
                    <div className="min-w-0">
                      <p className="m-0 text-sm font-medium">{row.project_name}</p>
                      <p className="text-muted m-0 text-xs">{row.client_name}</p>
                    </div>
                    <span>{t('reports.total', { minutes: row.minutes })}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section className="flex flex-col gap-2">
            <h2 className="m-0 text-sm font-semibold tracking-tight">{t('reports.byMember')}</h2>
            <ul className="stack-list">
              {data.by_member.map((row) => (
                <li key={row.user_id}>
                  <div className="row-split">
                    <span className="text-sm font-medium">
                      {memberLabel({
                        display_name: row.display_name,
                        email: row.email,
                      })}
                    </span>
                    <span>{t('reports.total', { minutes: row.minutes })}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}
    </>
  );
}
