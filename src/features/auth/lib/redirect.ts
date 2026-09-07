import { paths } from '@/app/router/paths';

export function redirectFrom(state: unknown): string {
  if (
    state &&
    typeof state === 'object' &&
    'from' in state &&
    state.from &&
    typeof state.from === 'object' &&
    'pathname' in state.from &&
    typeof state.from.pathname === 'string' &&
    state.from.pathname.startsWith('/')
  ) {
    return state.from.pathname;
  }

  return paths.home;
}
