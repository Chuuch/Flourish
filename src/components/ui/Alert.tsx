import type { ReactNode } from 'react';
import { CircleAlert } from 'lucide-react';

interface AlertProps {
  children: ReactNode;
}

export function Alert({ children }: AlertProps) {
  return (
    <div
      role="alert"
      className="border-line bg-canvas-elevated text-ink flex gap-2.5 rounded-[var(--radius-panel)] border px-3 py-2.5 text-sm leading-snug"
    >
      <CircleAlert className="text-danger mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
