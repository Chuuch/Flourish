import { toast } from 'sonner';
import { t, type MessageKey } from '../i18n';
import { ApiError } from '@/lib/api/errors';

export function notifySuccess(key: MessageKey): void {
  toast.success(t(key));
}

export function notifyError(error: unknown): void {
  if (error instanceof ApiError || error instanceof Error) {
    toast.error(error.message);
    return;
  }

  toast.error(t('toast.failed'));
}
