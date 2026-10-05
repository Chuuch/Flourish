import { useI18n } from '@/features/i18n';
import { ChangePasswordForm } from '../components/ChangePasswordForm';
import { DisplayNameForm } from '../components/DisplayNameForm';
import { OrganizationNameForm } from '@/features/organization/components/OrganizationNameForm';
import { useAuthStore } from '../store/auth.store';
import { canManageMembers } from '@/features/members/schemas/member.schema';

export function ChangePasswordPage() {
  const { t } = useI18n();
  const role = useAuthStore((state) => state.role);
  const showOrganization = canManageMembers(role);

  return (
    <main>
      <div className="page-header">
        <h1>{t('auth.account')}</h1>
      </div>

      {showOrganization ? (
        <div className="page-grid page-grid-2">
          <OrganizationNameForm />
          <div className="panel-stack">
            <DisplayNameForm />
            <ChangePasswordForm />
          </div>
        </div>
      ) : (
        <div className="page-grid page-grid-equal">
          <DisplayNameForm />
          <ChangePasswordForm />
        </div>
      )}
    </main>
  );
}
