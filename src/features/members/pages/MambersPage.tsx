import { useI18n } from '@/features/i18n';
import { CreateMemberForm } from '../components/CreateMemberForm';
import { MemberList } from '../components/MemberList';

export function MembersPage() {
  const { t } = useI18n();

  return (
    <main>
      <div className="page-header">
        <h1>{t('members.title')}</h1>
      </div>
      <CreateMemberForm />
      <MemberList />
    </main>
  );
}
