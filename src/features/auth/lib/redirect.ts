import { paths } from '@/app/router/paths';

function isSafeInternalPath(path: string): boolean {
  if (!path.startsWith('/') || path.startsWith('//')) {
    return false;
  }

  try {
    return new URL(path, window.location.origin).origin === window.location.origin;
  } catch {
    return false;
  }
}

export function redirectFrom(state: unknown): string {
  if (
    state &&
    typeof state === 'object' &&
    'from' in state &&
    state.from &&
    typeof state.from === 'object' &&
    'pathname' in state.from &&
    typeof state.from.pathname === 'string' &&
    isSafeInternalPath(state.from.pathname)
  ) {
    return state.from.pathname;
  }

  return paths.home;
}
