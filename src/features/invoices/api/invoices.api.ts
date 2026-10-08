import { http } from '@/lib/api/http';
import { withIdempotencyKey } from '@/lib/api/idempotency';
import { invoiceSchema, invoicesPageSchema } from '../schemas/invoice.schema';
import z from 'zod';
import axios from 'axios';
import { ApiError, apiErrorResponseSchema } from '@/lib/api/errors';
import { apiClient } from '@/lib/api/client';

const DEFAULT_LIMIT = 50;

export const fetchPortalInvoices = (params?: { q?: string; cursor?: string; limit?: number }) =>
  http.get('/client-auth/invoices', invoicesPageSchema, {
    params: {
      limit: params?.limit ?? DEFAULT_LIMIT,
      ...(params?.q ? { q: params.q } : {}),
      ...(params?.cursor ? { cursor: params.cursor } : {}),
    },
  });

export const fetchPortalInvoice = (invoiceId: string) =>
  http.get(`/client-auth/invoices/${invoiceId}`, invoiceSchema);

export const fetchInvoices = (
  clientId: string,
  params?: { q?: string; cursor?: string; limit?: number },
) =>
  http.get(`/clients/${clientId}/invoices`, invoicesPageSchema, {
    params: {
      limit: params?.limit ?? DEFAULT_LIMIT,
      ...(params?.q ? { q: params.q } : {}),
      ...(params?.cursor ? { cursor: params.cursor } : {}),
    },
  });

export const fetchInvoice = (invoiceId: string) =>
  http.get(`/invoices/${invoiceId}`, invoiceSchema);

export const createInvoice = (clientId: string, from: string, to: string) =>
  http.post(`/clients/${clientId}/invoices`, invoiceSchema, { from, to }, withIdempotencyKey());

export const updateInvoice = (invoiceId: string, from: string, to: string) =>
  http.patch(`/invoices/${invoiceId}`, invoiceSchema, { from, to });

export const sendInvoice = (invoiceId: string) =>
  http.post(`/invoices/${invoiceId}/send`, invoiceSchema, undefined, withIdempotencyKey());

export const markInvoicePaid = (invoiceId: string) =>
  http.post(`/invoices/${invoiceId}/paid`, invoiceSchema, undefined, withIdempotencyKey());

export const deleteInvoice = (invoiceId: string) =>
  http.delete(`/invoices/${invoiceId}`, z.unknown());

function filenameFromDisposition(header: string | undefined): string | null {
  if (!header) {
    return null;
  }
  const match = /filename="([^"]+)"/i.exec(header);
  return match?.[1] ?? null;
}

async function throwBlobError(error: unknown): Promise<never> {
  if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
    const text = await error.response.data.text();
    try {
      const parsed = apiErrorResponseSchema.safeParse(JSON.parse(text));
      if (parsed.success) {
        throw new ApiError(
          parsed.data.error.message,
          error.response.status,
          parsed.data.error.code,
          parsed.data.error.details,
        );
      }
    } catch (parsedError) {
      if (parsedError instanceof ApiError) {
        throw parsedError;
      }
    }
  }

  if (error instanceof ApiError) {
    throw error;
  }

  throw new ApiError('Download failed', 0, 'DOWNLOAD_FAILED');
}

export async function downloadInvoicePdf(
  invoiceId: string,
  pdfPath = `/invoices/${invoiceId}/pdf`,
): Promise<void> {
  try {
    const response = await apiClient.get<Blob>(pdfPath, {
      responseType: 'blob',
      timeout: 30_000,
    });

    const blob = response.data;
    const dispositionHeader = response.headers['content-disposition'] as unknown;
    const filename =
      filenameFromDisposition(
        typeof dispositionHeader === 'string' ? dispositionHeader : undefined,
      ) ?? `invoice-${invoiceId}.pdf`;

    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    await throwBlobError(error);
  }
}

export const downloadPortalInvoicePdf = (invoiceId: string) =>
  downloadInvoicePdf(invoiceId, `/client-auth/invoices/${invoiceId}/pdf`);
