import type { MessageKey } from '../i18n';

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      successKey?: MessageKey;
      silent?: boolean;
    };
  }
}
