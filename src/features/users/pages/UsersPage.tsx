import { useI18n } from '@/features/i18n';
import { CreateUserForm } from '../components/CreateUserForm';
import { UserList } from '../components/UserList';

export function UsersPage() {
  const { t } = useI18n();
  return (
    <main>
      <h1>{t('users.title')}</h1>
      <CreateUserForm />
      <UserList />
    </main>
  );
}
