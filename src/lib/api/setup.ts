import type { AxiosError, InternalAxiosRequestConfig } from "axios";

import { apiClient } from "./client";
import { ApiError } from "./errors";

interface ErrorResponse {
  message?: string
  code?: string
  details?: unknown
}

function isErrorResponse(value: unknown): value is ErrorResponse {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  return 'message' in value || 'code' in value || 'details' in value
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  return config
})

apiClient.interceptors.response.use(
  (response) => response,

  (error: AxiosError) => {
    if (!error.response) {
      return Promise.reject(new ApiError("Unable to connect to the server.", 0))
    }

    const status = error.response.status
    const data = error.response.data

    if (isErrorResponse(data)) {
      return Promise.reject(
        new ApiError(
          data.message ?? 'Request failed.',
          status,
          data.code,
          data.details,
        ),
      )
    }

    return Promise.reject(new ApiError('Request failed.', status))
  },
)
