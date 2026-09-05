import { NavLink, Outlet } from 'react-router';
import { paths } from '../router/paths';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'font-semibold underline' : 'hover:underline';

export function RootLayout() {
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
        </nav>
      </header>

      <div className="flex-1 px-6 py-8">
        <Outlet />
      </div>
    </div>
  );
}
