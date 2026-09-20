import axios, { type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { ApiError, apiErrorResponseSchema } from './errors';
import { refreshResponseSchema } from '@/features/auth/schemas/auth.schema';
import { notifyUnauthorized } from './session';
import { portalAuthResponseSchema } from '@/features/portal/schemas/portal-auth.schema';

type RetryConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export type AuthRealm = 'agency' | 'portal';

let access_token: string | null = null;
let authRealm: AuthRealm | null = null;
let refreshPromise: Promise<string> | null = null;

export const setAccessToken = (token: string | null): void => {
  access_token = token;
};

export const getAccessToken = (): string | null => access_token;

export const setAuthRealm = (realm: AuthRealm | null): void => {
  authRealm = realm;
};

export const getAuthRealm = (): AuthRealm | null => authRealm;

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
      return new ApiError(
        parsed.data.error.message,
        status,
        parsed.data.error.code,
        parsed.data.error.details,
      );
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
    const refreshPath = authRealm === 'portal' ? '/client-auth/refresh' : '/auth/refresh';
    const schema = authRealm === 'portal' ? portalAuthResponseSchema : refreshResponseSchema;

    refreshPromise = refreshClient
      .post(refreshPath)
      .then((response) => {
        const parsed = schema.safeParse(response.data);

        if (!parsed.success) {
          throw new ApiError('Response validation failed ', response.status, 'INVALID_RESPONSE');
        }

        setAccessToken(parsed.data.access_token);
        return parsed.data.access_token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown): Promise<never> => {
    const apiError = toApiError(error);
    const originalRequest = axios.isAxiosError(error)
      ? (error.config as RetryConfig | undefined)
      : undefined;

    if (apiError.status === 401 && originalRequest && !originalRequest._retry) {
      try {
        const token = await refreshAccessToken();
        originalRequest._retry = true;
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return await apiClient.request(originalRequest);
      } catch {
        notifyUnauthorized();
      }
    }

    return Promise.reject(apiError);
  },
);
