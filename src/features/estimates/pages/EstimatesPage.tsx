import { estimateNewPath } from '@/app/router/paths';
import { Button } from '@/components/ui';
import { useI18n } from '@/features/i18n';
import { Link } from 'react-router';
import { EstimateList } from '../components/EstimateList';

export function EstimatesPage() {
  const { t } = useI18n();

  return (
    <main>
      <div className="page-header">
        <h1>{t('estimates.title')}</h1>
      </div>
      <div className="form-actions mb-4">
        <Link to={estimateNewPath()}>
          <Button type="button">{t('estimates.new')}</Button>
        </Link>
      </div>
      <EstimateList />
    </main>
  );
}
