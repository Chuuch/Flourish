import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

interface FieldGridProps {
  columns?: 2 | 3 | undefined;
  wide?: boolean | undefined;
  children: ReactNode;
  className?: string | undefined;
}

export function FieldGrid({ columns = 2, wide = false, children, className }: FieldGridProps) {
  return (
    <div
      className={cn(
        'field-grid',
        columns === 3 ? 'field-grid-3' : 'field-grid-2',
        wide && columns === 2 && 'field-grid-wide-3',
        className,
      )}
    >
      {children}
    </div>
  );
}
