import { Link } from 'react-router';
import { LoginForm } from '../components/LoginForm';
import { paths } from '@/app/router/paths';

export function LoginPage() {
  return (
    <main>
      <h1>Sign in</h1>
      <LoginForm />
      <p>
        <Link to={paths.portalLogin}>Client sign in</Link>
      </p>
    </main>
  );
}
