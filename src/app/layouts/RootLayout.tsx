import { NavLink, Outlet } from 'react-router';
import { paths } from '../router/paths';
import { useAuthStore } from '@/features/auth';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'font-semibold underline' : 'hover:underline';

export function RootLayout() {
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4">
        <nav aria-label="Main" className="flex gap-6">
          <NavLink to={paths.home} className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to={paths.users} className={navLinkClass}>
            Users
          </NavLink>
          {user ? (
            <button type="button" onClick={clearSession}>
              Sign out
            </button>
          ) : (
            <NavLink to={paths.login} className={navLinkClass}>
              Sign in
            </NavLink>
          )}
        </nav>
      </header>

      <div className="flex-1 px-6 py-8">
        <Outlet />
      </div>
    </div>
  );
}
