import { env } from '@/config/env';
import { useAuthStore } from '@/features/auth';
import { getAccessToken, refreshAccessToken } from '@/lib/api/client';
import { notifyUnauthorized } from '@/lib/api/session';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  applyRealtimeEvent,
  catchUpRealtimeQueries,
  realtimeEventSchema,
} from '../lib/realtimeEvent';

class FatalRealtimeError extends Error {}

export function useRealtimeEvents(): void {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const portal = role === 'client';

  useEffect(() => {
    if (!user || !role) {
      return;
    }

    const path = portal ? '/client-auth/events' : '/events';
    const url = `${env.API_URL}${path}`;
    const controller = new AbortController();

    const headers: Record<string, string> = {
      Accept: 'text/event-stream',
    };
    Object.defineProperty(headers, 'Authorization', {
      enumerable: true,
      configurable: true,
      get(): string {
        const token = getAccessToken();
        return token ? `Bearer ${token}` : '';
      },
    });

    void fetchEventSource(url, {
      method: 'GET',
      headers,
      signal: controller.signal,
      credentials: 'include',
      async onopen(response: Response) {
        if (response.ok) {
          catchUpRealtimeQueries(queryClient, portal);
          return;
        }

        if (response.status === 401) {
          try {
            await refreshAccessToken();
          } catch {
            notifyUnauthorized();
            throw new FatalRealtimeError('unauthorized');
          }
          throw new Error('retry after refresh');
        }

        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          throw new FatalRealtimeError(`sse open failed: ${String(response.status)}`);
        }

        throw new Error(`sse open retry: ${String(response.status)}`);
      },
      onmessage(message: { data: string }) {
        if (!message.data) {
          return;
        }

        let json: unknown;
        try {
          json = JSON.parse(message.data) as unknown;
        } catch {
          return;
        }

        const parsed = realtimeEventSchema.safeParse(json);
        if (!parsed.success) {
          return;
        }

        applyRealtimeEvent(queryClient, parsed.data, portal);
      },
      onclose() {
        throw new Error('sse closed');
      },
      onerror(error: unknown) {
        if (error instanceof FatalRealtimeError) {
          throw error;
        }
      },
    });

    return () => {
      controller.abort();
    };
  }, [queryClient, user, role, portal]);
}
