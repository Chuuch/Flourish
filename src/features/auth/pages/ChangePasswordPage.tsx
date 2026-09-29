import { useI18n } from '@/features/i18n';
import { ChangePasswordForm } from '../components/ChangePasswordForm';
import { DisplayNameForm } from '../components/DisplayNameForm';
import { OrganizationNameForm } from '@/features/organization/components/OrganizationNameForm';

export function ChangePasswordPage() {
  const { t } = useI18n();
  return (
    <main>
      <h1>{t('auth.account')}</h1>
      <h2>{t('auth.displayName')}</h2>
      <DisplayNameForm />
      <OrganizationNameForm />
      <h2>{t('auth.changePassword')}</h2>
      <ChangePasswordForm />
    </main>
  );
}
