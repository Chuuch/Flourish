import { NavLink, Outlet } from 'react-router';
import { paths } from '../router/paths';
import { useAuthStore } from '@/features/auth';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { Button } from '@/components/ui';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'font-semibold underline' : 'hover:underline';

export function RootLayout() {
  const user = useAuthStore((state) => state.user);
  const organization = useAuthStore((state) => state.organization);
  const client = useAuthStore((state) => state.client);
  const role = useAuthStore((state) => state.role);
  const logout = useLogout();
  const isPortal = role === 'client';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4">
        <nav aria-label="Main" className="flex gap-6">
          <NavLink to={isPortal ? paths.portal : paths.home} className={navLinkClass} end>
            Home
          </NavLink>
          {isPortal ? null : (
            <>
              <NavLink to={paths.members} className={navLinkClass}>
                Members
              </NavLink>
              <NavLink to={paths.clients} className={navLinkClass}>
                Clients
              </NavLink>
            </>
          )}
          {user ? (
            <>
              {isPortal ? (
                client ? (
                  <span>{client.name}</span>
                ) : null
              ) : organization ? (
                <span>{organization.name}</span>
              ) : null}
              <Button
                type="button"
                onClick={() => {
                  logout.mutate();
                }}
                disabled={logout.isPending}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <NavLink to={paths.login} className={navLinkClass}>
                Sign in
              </NavLink>
              <NavLink to={paths.register} className={navLinkClass}>
                Create account
              </NavLink>
              <NavLink to={paths.portalLogin} className={navLinkClass}>
                Client sign in
              </NavLink>
            </>
          )}
        </nav>
      </header>

      <div className="flex-1 px-6 py-8">
        <Outlet />
      </div>
    </div>
  );
}
