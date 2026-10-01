import { Alert, Button, TextField } from '@/components/ui';
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
        <TextField
          name="from"
          type="date"
          label={t('reports.from')}
          defaultValue={fromDate}
          required
        />
        <TextField name="to" type="date" label={t('reports.to')} defaultValue={toDate} required />
        <Button type="submit">{t('reports.apply')}</Button>
      </form>

      {isPending ? <ListSkeleton label={t('reports.loading')} /> : null}

      {isError ? (
        <Alert>
          <p>
            {t('reports.loadError', {
              message: error instanceof Error ? error.message : '',
            })}
          </p>
          <button type="button" onClick={() => void refetch()}>
            {t('common.retry')}
          </button>
        </Alert>
      ) : null}

      {data ? <p>{t('reports.total', { minutes: data.total_minutes })}</p> : null}

      {data && data.total_minutes === 0 ? <p>{t('reports.empty')}</p> : null}

      {data && data.total_minutes > 0 ? (
        <>
          <section>
            <h2>{t('reports.byClient')}</h2>
            <ul>
              {data.by_client.map((row) => (
                <li key={row.client_id}>
                  {t('reports.clientLine', { name: row.client_name, minutes: row.minutes })}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>{t('reports.byProject')}</h2>
            <ul>
              {data.by_project.map((row) => (
                <li key={row.project_id}>
                  {t('reports.projectLine', {
                    name: row.project_name,
                    client: row.client_name,
                    minutes: row.minutes,
                  })}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>{t('reports.byMember')}</h2>
            <ul>
              {data.by_member.map((row) => (
                <li key={row.user_id}>
                  {t('reports.memberLine', {
                    name: memberLabel({
                      display_name: row.display_name,
                      email: row.email,
                    }),
                    minutes: row.minutes,
                  })}
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}
    </>
  );
}
