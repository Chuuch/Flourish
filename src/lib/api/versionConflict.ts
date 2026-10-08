import { ApiError } from './errors';

const VERSION_CONFLICT_CODES = new Set(['task_version_mismatch', 'ticket_version_mismatch']);

export function isVersionConflict(error: unknown): error is ApiError {
  return error instanceof ApiError && !!error.code && VERSION_CONFLICT_CODES.has(error.code);
}
