import { paths } from '@/app/router/paths';
import { useAuthStore } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { InboxList } from '@/features/tasks/components/InboxList';
import { Navigate } from 'react-router';

export function HomePage() {
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const { t } = useI18n();

  if (role === 'client') {
    return <Navigate to={paths.portal} replace />;
  }

  if (!user) {
    return (
      <main>
        <h1>{t('home.brand')}</h1>
      </main>
    );
  }

  return (
    <main>
      <h1>{t('home.brand')}</h1>
      <h2>{t('home.inbox')}</h2>
      <InboxList />
    </main>
  );
}
