import { createContext, type ReactNode } from 'react';

export type OpenModalOptions = {
  title: string;
  content: ReactNode;
  id?: string;
};

export type ModalContextValue = {
  openModal: (options: OpenModalOptions) => string;
  closeModal: (id?: string) => void;
};

export const ModalContext = createContext<ModalContextValue | null>(null);
