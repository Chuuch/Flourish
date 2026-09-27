import { useI18n } from '@/features/i18n';
import { RegisterForm } from '../components/RegisterForm';

export function RegisterPage() {
  const { t } = useI18n();
  return (
    <main>
      <h1>{t('auth.createAccountHeading')}</h1>
      <RegisterForm />
    </main>
  );
}
