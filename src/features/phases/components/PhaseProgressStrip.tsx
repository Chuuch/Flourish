import { cn } from '@/lib/cn';
import type { Phase } from '../schemas/phase.schema';
import { Check } from 'lucide-react';

interface PhaseProgressStripProps {
  phases: Phase[];
  className?: string;
  interactive?: boolean;
  disabled?: boolean;
  onSelect?: (phaseId: string) => void;
}

export function PhaseProgressStrip({
  phases,
  className,
  interactive = false,
  disabled = false,
  onSelect,
}: PhaseProgressStripProps) {
  const ordered = [...phases].sort((a, b) => a.sort_order - b.sort_order);

  if (ordered.length === 0) {
    return null;
  }

  return (
    <ol
      className={cn('m-0 flex list-none items-start gap-0 p-0', className)}
      aria-label="Project phases"
    >
      {ordered.map((phase, index) => {
        const done = phase.status === 'done';
        const active = phase.status === 'in_progress';
        const canSelect = interactive && !disabled && Boolean(onSelect);
        const isLast = index === ordered.length - 1;

        const marker = (
          <span
            className={cn(
              'relative z-10 inline-flex size-8 shrink-0 items-center justify-center rounded-full border-2',
              done
                ? 'border-accent bg-accent text-[#171717]'
                : active
                  ? 'border-accent bg-surface text-transparent'
                  : 'border-line bg-surface text-transparent',
              canSelect &&
                'transition-[border-color,background-color,box-shadow] group-hover:border-accent group-hover:shadow-(--focus-ring)',
              canSelect && active && !done && 'group-hover:bg-accent-soft',
            )}
            aria-current={active ? 'step' : undefined}
          >
            {done ? <Check className="size-4" strokeWidth={2.5} aria-hidden="true" /> : null}
          </span>
        );

        const label = (
          <span
            className={cn(
              'mt-2 max-w-30 text-center text-xs leading-snug',
              active || done ? 'text-ink font-medium' : 'text-muted',
              canSelect && 'group-hover:text-ink',
            )}
          >
            {phase.name}
          </span>
        );

        const step = (
          <>
            {marker}
            {label}
          </>
        );

        return (
          <li key={phase.id} className="relative flex min-w-0 flex-1 flex-col items-center">
            {!isLast ? (
              <span
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute top-4 left-1/2 z-0 h-0.5 w-full -translate-y-1/2',
                  done ? 'bg-accent' : 'bg-accent/25',
                )}
              />
            ) : null}

            {canSelect ? (
              <button
                type="button"
                className="group flex w-full cursor-pointer flex-col items-center border-0 bg-transparent p-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                aria-label={phase.name}
                disabled={disabled}
                onClick={() => {
                  onSelect?.(phase.id);
                }}
              >
                {step}
              </button>
            ) : (
              <div className="flex w-full flex-col items-center">{step}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
