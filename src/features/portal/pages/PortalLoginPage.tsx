import { Link } from 'react-router';
import { PortalLoginForm } from '../components/PortalLoginForm';
import { paths } from '@/app/router/paths';

export function PortalLoginPage() {
  return (
    <main>
      <h1>Client sign in</h1>
      <PortalLoginForm />
      <p>
        <Link to={paths.forgotPassword}>Forgot password</Link>
      </p>
      <p>
        <Link to={paths.login}>Staff sign in</Link>
      </p>
    </main>
  );
}
