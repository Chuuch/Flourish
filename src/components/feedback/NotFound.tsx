import { paths } from '@/app/router/paths';
import { Link } from 'react-router';

export function NotFound() {
  return (
    <main>
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to={paths.home}>Go home</Link>
    </main>
  );
}
