import { useI18n } from '@/features/i18n';
import { AcceptInviteForm } from '../components/AcceptInviteForm';

export function AcceptInvitePage() {
  const { t } = useI18n();
  return (
    <main>
      <h1>{t('auth.setPassword')}</h1>
      <AcceptInviteForm />
    </main>
  );
}
