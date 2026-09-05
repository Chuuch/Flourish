import axios, { type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { ApiError, apiErrorResponseSchema } from './errors';

let accessToken: string | null = null;

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

export const getAccessToken = (): string | null => accessToken;

export const apiClient = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },

  withCredentials: true,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown): Promise<never> => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      const body: unknown = error.response?.data;
      const parsed = apiErrorResponseSchema.safeParse(body);

      if (parsed.success) {
        return Promise.reject(
          new ApiError(parsed.data.message, status, parsed.data.code, parsed.data.details),
        );
      }

      return Promise.reject(new ApiError(error.message, status, error.code));
    }

    if (error instanceof Error) {
      return Promise.reject(new ApiError(error.message, 0));
    }

    return Promise.reject(new ApiError('An unknown error occurred', 0));
  },
);
