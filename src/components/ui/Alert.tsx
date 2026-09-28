import type { ReactNode } from 'react';
import { CircleAlert } from 'lucide-react';

interface AlertProps {
  children: ReactNode;
}

export function Alert({ children }: AlertProps) {
  return (
    <div
      role="alert"
      className="flex gap-2 rounded-lg border border-danger/30 bg-danger/8 px-3 py-2 text-sm text-ink"
    >
      <CircleAlert className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden="true" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
