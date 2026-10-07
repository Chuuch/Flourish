import { Button } from '@/components/ui';
import { useI18n } from '@/features/i18n';
import { cn } from '@/lib/cn';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useId, useRef, type ReactNode } from 'react';

type ModalShellProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function ModalShell({ open, title, onClose, children }: ModalShellProps) {
  const { t } = useI18n();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) {
      return;
    }

    previousFocus.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = window.requestAnimationFrame(() => {
      panelRef.current?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) {
        return;
      }

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus.current?.focus();
    };
  }, [open, onClose]);

  const overlayMotion = reduceMotion
    ? { initial: false as const, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };

  const panelMotion = reduceMotion
    ? { initial: false as const, animate: { opacity: 1, y: 0 } }
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 8 },
      };

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <motion.button
            type="button"
            aria-label={t('common.close')}
            className="bg-ink/40 absolute inset-0 cursor-pointer border-0"
            transition={{ duration: 0.16 }}
            onClick={onClose}
            {...overlayMotion}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={cn(
              'border-line bg-surface relative z-10 flex max-h-[min(90vh,44rem)] w-full max-w-lg flex-col overflow-hidden border',
              'rounded-(--radius-panel) shadow-none',
            )}
            transition={{ duration: 0.18 }}
            {...panelMotion}
          >
            <div className="border-line flex items-center justify-between gap-3 border-b px-4 py-3">
              <h2 id={titleId} className="m-0 text-base font-semibold tracking-tight">
                {title}
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label={t('common.close')}
                className="shrink-0 px-2"
                onClick={onClose}
              >
                <X className="size-4" aria-hidden="true" />
              </Button>
            </div>
            <div className="overflow-y-auto px-4 py-4">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
