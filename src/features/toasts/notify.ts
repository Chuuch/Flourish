import { toast } from 'sonner';
import { t, type MessageKey } from '../i18n';
import { ApiError } from '@/lib/api/errors';
import { isVersionConflict } from '@/lib/api/versionConflict';

export function notifySuccess(key: MessageKey): void {
  toast.success(t(key));
}

export function notifyError(error: unknown): void {
  if (isVersionConflict(error)) {
    toast.error(t('toast.versionConflict'));
    return;
  }

  if (error instanceof ApiError || error instanceof Error) {
    toast.error(error.message);
    return;
  }

  toast.error(t('toast.failed'));
}
