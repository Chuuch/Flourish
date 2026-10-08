import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { ModalContext, type OpenModalOptions } from './modal-context';
import { ModalShell } from './components/ModalShell';

type ModalEntry = {
  id: string;
  title: string;
  content: ReactNode;
};

export function ModalProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<ModalEntry[]>([]);

  const openModal = useCallback((options: OpenModalOptions) => {
    const id = options.id ?? crypto.randomUUID();
    setStack((current) => [
      ...current,
      {
        id,
        title: options.title,
        content: options.content,
      },
    ]);
    return id;
  }, []);

  const closeModal = useCallback((id?: string) => {
    setStack((current) => {
      if (current.length === 0) {
        return current;
      }
      if (!id) {
        return current.slice(0, -1);
      }
      return current.filter((entry) => entry.id !== id);
    });
  }, []);

  const value = useMemo(
    () => ({
      openModal,
      closeModal,
    }),
    [openModal, closeModal],
  );

  const top = stack[stack.length - 1];

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ModalShell
        open={top !== undefined}
        title={top?.title ?? ''}
        onClose={() => {
          if (top) {
            closeModal(top.id);
          }
        }}
      >
        {top?.content}
      </ModalShell>
    </ModalContext.Provider>
  );
}
