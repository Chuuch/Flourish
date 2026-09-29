import { useMemo, useState } from 'react';
import { Alert } from '@/components/ui';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { useI18n } from '@/features/i18n';
import { useTimeEntryRange } from '../hooks/useTimeEntryRange';
import { utcWeekRange } from '../lib/weekRange';
import { timeEntryLabel } from '../schemas/time-entry.schema';

export function TimeWeekPage() {
  const { t } = useI18n();
  const [weekOffset, setWeekOffset] = useState(0);
  const range = useMemo(() => utcWeekRange(weekOffset), [weekOffset]);
  const { data, isPending, isError, error, refetch } = useTimeEntryRange(range.from, range.to);
  const total = data?.reduce((sum, entry) => sum + entry.minutes, 0) ?? 0;
  const weekStart = range.from.slice(0, 10);

  if (isPending) {
    return (
      <main>
        <ListSkeleton label={t('time.loading')} />
      </main>
    );
  }

  if (isError) {
    return (
      <main>
        <Alert>
          <p>{t('time.loadError', { message: error instanceof Error ? error.message : '' })}</p>
          <button type="button" onClick={() => void refetch()}>
            {t('common.retry')}
          </button>
        </Alert>
      </main>
    );
  }

  return (
    <main>
      <h1>{t('time.title')}</h1>
      <p>{t('time.weekOf', { date: weekStart })}</p>
      <p>{t('time.weekTotal', { minutes: total })}</p>
      <p>
        <button
          type="button"
          onClick={() => {
            setWeekOffset((current) => current - 1);
          }}
        >
          {t('time.prevWeek')}
        </button>{' '}
        <button
          type="button"
          onClick={() => {
            setWeekOffset((current) => current + 1);
          }}
        >
          {t('time.nextWeek')}
        </button>
      </p>
      {data.length === 0 ? (
        <p>{t('time.weekEmpty')}</p>
      ) : (
        <ul>
          {data.map((entry) => (
            <li key={entry.id}>{timeEntryLabel(entry)}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
