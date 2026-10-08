import { useSearchParams } from 'react-router';
import { useI18n } from '@/features/i18n';
import { ReportList } from '../components/ReportList';
import { defaultReportDates } from '../lib/reportRange';

export function ReportsPage() {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaults = defaultReportDates();
  const fromDate = searchParams.get('from') ?? defaults.from;
  const toDate = searchParams.get('to') ?? defaults.to;

  return (
    <main>
      <div className="page-header">
        <h1>{t('reports.title')}</h1>
      </div>
      <ReportList
        fromDate={fromDate}
        toDate={toDate}
        onRangeChange={(nextFrom, nextTo) => {
          setSearchParams({ from: nextFrom, to: nextTo });
        }}
      />
    </main>
  );
}
