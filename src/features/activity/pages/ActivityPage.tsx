import { useI18n } from '@/features/i18n';
import { ActivityList } from '../components/ActivityList';

export function ActivityPage() {
  const { t } = useI18n();

  return (
    <main>
      <h1>{t('activity.title')}</h1>
      <ActivityList />
    </main>
  );
}
