import { http } from '@/lib/api/http';
import {
  ticketFileSchema,
  ticketFilesSchema,
  type CreateTicketFileInput,
  type TicketFile,
} from '../schemas/ticket-file.schema';
import { ApiError } from '@/lib/api/errors';

export const fetchPortalTicketFiles = (ticketId: string) =>
  http.get(`/client-auth/tickets/${ticketId}/files`, ticketFilesSchema);

export const createPortalTicketFile = (ticketId: string, input: CreateTicketFileInput) =>
  http.post(`/client-auth/tickets/${ticketId}/files`, ticketFileSchema, input);

export async function putTicketObject(uploadUrl: string, file: File): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new ApiError('Upload failed', response.status, 'UPLOAD_FAILED');
  }
}

export async function uploadPortalTicketFile(ticketId: string, file: File): Promise<TicketFile> {
  const created = await createPortalTicketFile(ticketId, {
    filename: file.name,
    content_type: file.type as CreateTicketFileInput['content_type'],
    size: file.size,
  });

  if (!created.upload_url) {
    throw new ApiError('Upload URL missing', 0, 'INVALID_RESPONSE');
  }

  await putTicketObject(created.upload_url, file);

  return created;
}
