import { paths } from '@/app/router/paths';
import { SearchField } from '@/components/ui';
import { useAuthStore } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { InboxList } from '@/features/tasks/components/InboxList';
import { useListSearch } from '@/hooks/useListSearch';
import { Navigate } from 'react-router';
import { GuestHome } from '../components/GuestHome';

export function HomePage() {
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const { t } = useI18n();
  const { value, setValue, query } = useListSearch();

  if (role === 'client') {
    return <Navigate to={paths.portal} replace />;
  }

  if (!user) {
    return <GuestHome />;
  }

  return (
    <main>
      <div className="page-header">
        <h1>{t('home.inbox')}</h1>
      </div>
      <div className="mb-4">
        <SearchField
          label={t('common.search')}
          placeholder={t('inbox.searchPlaceholder')}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
        />
      </div>
      <InboxList query={query} />
    </main>
  );
}
