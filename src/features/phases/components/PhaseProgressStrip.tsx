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
        const connectorFilled = done;
        const canSelect = interactive && !disabled && Boolean(onSelect);

        const marker = (
          <span
            className={cn(
              'inline-flex size-8 shrink-0 items-center justify-center rounded-full border-2',
              done && 'border-accent bg-accent text-accent-fg',
              active && !done && 'border-accent bg-surface text-transparent',
            )}
            aria-current={active ? 'step' : undefined}
          >
            {done ? <Check className="size-4" strokeWidth={2.5} aria-hidden="true" /> : null}
          </span>
        );

        return (
          <li
            key={phase.id}
            className={cn(
              'flex min-w-0 flex-1 flex-col items-center',
              index < ordered.length - 1 && 'relative',
            )}
          >
            <div className="flex w-full items-center">
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    'h-0.5 flex-1',
                    ordered[index - 1]?.status === 'done' ? 'bg-accent' : 'bg-accent/25',
                  )}
                />
              ) : (
                <span className="flex-1" aria-hidden="true" />
              )}

              {canSelect ? (
                <button
                  type="button"
                  className="rounded-full focus-visible:outline-none focus-visible:shadow-(--focus-ring)"
                  aria-label={phase.name}
                  disabled={disabled}
                  onClick={() => {
                    onSelect?.(phase.id);
                  }}
                >
                  {marker}
                </button>
              ) : (
                marker
              )}

              {index < ordered.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={cn('h-0.5 flex-1', connectorFilled ? 'bg-accent' : 'bg-accent/25')}
                />
              ) : (
                <span className="flex-1" aria-hidden="true" />
              )}
            </div>

            <span
              className={cn(
                'mt-2 max-w-30 text-center text-xs leading-snug',
                active || done ? 'text-ink font-medium' : 'text-muted',
              )}
            >
              {phase.name}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
