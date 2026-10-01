import { useI18n } from '@/features/i18n';
import { NotificationList } from '../components/NotificationList';

export function NotificationsPage() {
  const { t } = useI18n();

  return (
    <main>
      <h1>{t('notifications.title')}</h1>
      <NotificationList />
    </main>
  );
}
