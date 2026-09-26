import type { ReactNode } from 'react';

interface AlertProps {
  children: ReactNode;
}

export function Alert({ children }: AlertProps) {
  return (
    <div role="alert" className="rounded border border-line bg-surface text-ink px-3 py-2">
      {children}
    </div>
  );
}
