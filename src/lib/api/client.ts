import axios, { type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import { env } from '@/config/env';
import { ApiError, type ApiErrorResponse } from './errors';

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

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: unknown) =>
    Promise.reject(error instanceof Error ? error : new Error('Request configuration failed')),
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response.data as AxiosResponse,
  async (error: unknown): Promise<never> => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const status = axiosError.response?.status ?? 500;
      const data = axiosError.response?.data;

      const message = data?.message || axiosError.message || 'An unexpected API error occurred';
      const code = data?.code;
      const details = data?.details;

      return Promise.reject(new ApiError(message, status, code, details));
    }

    if (error instanceof Error) {
      return Promise.reject(new ApiError(error.message, 500));
    }

    return Promise.reject(new ApiError('An unknown error occurred', 500));
  },
);
