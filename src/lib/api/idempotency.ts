import type { AxiosRequestConfig } from 'axios';

/** Headers that attach a fresh Idempotency-Key for one mutating request. */
export function withIdempotencyKey(): Omit<AxiosRequestConfig, 'url' | 'method' | 'data'> {
  return {
    headers: {
      'Idempotency-Key': crypto.randomUUID(),
    },
  };
}
