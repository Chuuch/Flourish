import { cn } from '@/lib/cn';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { NavLink } from 'react-router';

interface SidebarLinkProps {
  to: string;
  icon: LucideIcon;
  children: ReactNode;
  end?: boolean | undefined;
}

export function SidebarLink({ to, icon: Icon, children, end }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      {...(end ? { end: true } : {})}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2.5 rounded-[var(--radius-control)] px-2.5 py-1.5 text-sm no-underline transition-colors duration-150 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]',
          isActive
            ? 'bg-canvas-elevated text-ink font-semibold'
            : 'text-muted hover:bg-canvas-elevated/70 hover:text-ink',
        )
      }
    >
      <Icon className="size-4 shrink-0 opacity-80" aria-hidden="true" />
      <span className="truncate">{children}</span>
    </NavLink>
  );
}
