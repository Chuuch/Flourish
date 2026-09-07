import axios, { type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { ApiError, apiErrorResponseSchema } from './errors';
import { refreshResponseSchema } from '@/features/auth/schemas/auth.schema';
import { notifyUnauthorized } from './session';

let accessToken: string | null = null;
let refreshPromise: Promise<string> | null = null;

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

export const getAccessToken = (): string | null => accessToken;

export const apiClient = axios.create({
  baseURL: env.API_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },

  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: env.API_URL,
  timeout: 10_000,
  withCredentials: true,
});

function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const parsed = apiErrorResponseSchema.safeParse(error.response?.data);

    if (parsed.success) {
      return new ApiError(parsed.data.message, status, parsed.data.code, parsed.data.details);
    }

    return new ApiError(error.message, status, error.code);
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 0);
  }
  return new ApiError('An unknown error has occurred', 0);
}

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post('/auth/refresh')
      .then((response) => {
        const parsed = refreshResponseSchema.safeParse(response.data);

        if (!parsed.success) {
          throw new ApiError('Response validation failed ', response.status, 'INVALID_RESPONSE');
        }

        setAccessToken(parsed.data.accessToken);
        return parsed.data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown): Promise<never> => {
    const apiError = toApiError(error);
    const originalRequest = axios.isAxiosError(error) ? error.config : undefined;
    const alreadyRetrieved = originalRequest?.headers['X-Retry'] === '1';

    if (apiError.status === 401 && originalRequest && !alreadyRetrieved) {
      try {
        const token = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        originalRequest.headers['X-Retry'] = '1';
        return await apiClient.request(originalRequest);
      } catch {
        notifyUnauthorized();
      }
    }

    return Promise.reject(apiError);
  },
);
