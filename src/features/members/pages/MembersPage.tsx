import { PageHeader, SearchField } from '@/components/ui';
import { useAuthStore } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { useModal } from '@/features/modal';
import { useListSearch } from '@/hooks/useListSearch';
import { CreateMemberForm } from '../components/CreateMemberForm';
import { MemberList } from '../components/MemberList';
import { canManageMembers } from '../schemas/member.schema';

export function MembersPage() {
  const { t } = useI18n();
  const { openModal, closeModal } = useModal();
  const role = useAuthStore((state) => state.role);
  const canCreate = canManageMembers(role);
  const { value, setValue, query } = useListSearch();

  return (
    <main>
      <PageHeader
        title={t('members.title')}
        {...(canCreate
          ? {
              createLabel: t('members.invite'),
              onCreate: () => {
                openModal({
                  title: t('members.inviteHeading'),
                  content: (
                    <CreateMemberForm
                      onSuccess={() => {
                        closeModal();
                      }}
                      onCancel={() => {
                        closeModal();
                      }}
                    />
                  ),
                });
              },
            }
          : {})}
      />
      <div className="mb-4">
        <SearchField
          label={t('common.search')}
          placeholder={t('members.searchPlaceholder')}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
        />
      </div>
      <MemberList query={query} />
    </main>
  );
}
