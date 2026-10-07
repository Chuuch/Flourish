import { useContext } from 'react';
import { ModalContext } from './modal-context';

export function useModal() {
  const value = useContext(ModalContext);
  if (!value) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return value;
}
