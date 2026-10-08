import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { notifyError, notifySuccess } from './notify';
import { ApiError } from '@/lib/api/errors';

describe('notify', () => {
  beforeEach(() => {
    vi.mocked(toast.success).mockClear();
    vi.mocked(toast.error).mockClear();
  });

  it('shows a success toast', () => {
    notifySuccess('toast.created');
    expect(toast.success).toHaveBeenCalledWith('Created');
  });

  it('shows an API error toast', () => {
    notifyError(new ApiError('forbidden', 403, 'forbidden'));
    expect(toast.error).toHaveBeenCalledWith('forbidden');
  });

  it('shows a version conflict toast', () => {
    notifyError(new ApiError('task was updated by someone else', 409, 'task_version_mismatch'));
    expect(toast.error).toHaveBeenCalledWith(
      'This was updated by someone else. Refresh and try again.',
    );
  });

  it('shows a fallback error toast', () => {
    notifyError('nope');
    expect(toast.error).toHaveBeenCalledWith('Something went wrong');
  });
});
