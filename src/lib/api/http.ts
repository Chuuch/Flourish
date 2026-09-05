import type { AxiosRequestConfig } from 'axios';
import z from 'zod';
import { apiClient } from './client';
import { ApiError } from './errors';

type RequestConfig = Omit<AxiosRequestConfig, 'url' | 'method' | 'data'>;

export async function request<T>(schema: z.ZodType<T>, config: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.request<unknown>(config);
  const parsed = schema.safeParse(response.data);

  if (!parsed.success) {
    throw new ApiError(
      'Response validation failed',
      response.status,
      'INVALID_RESPONSE',
      z.treeifyError(parsed.error),
    );
  }

  return parsed.data;
}

export const http = {
  get: <T>(url: string, schema: z.ZodType<T>, config?: RequestConfig) =>
    request(schema, { ...config, url, method: 'GET' }),

  post: <T>(url: string, schema: z.ZodType<T>, body?: unknown, config?: RequestConfig) =>
    request(schema, { ...config, url, method: 'POST', data: body }),

  put: <T>(url: string, schema: z.ZodType<T>, body?: unknown, config?: RequestConfig) =>
    request(schema, { ...config, url, method: 'PUT', data: body }),

  patch: <T>(url: string, schema: z.ZodType<T>, body?: unknown, config?: RequestConfig) =>
    request(schema, { ...config, url, method: 'PATCH', data: body }),

  delete: <T>(url: string, schema: z.ZodType<T>, config?: RequestConfig) =>
    request(schema, { ...config, url, method: 'DELETE' }),
};
