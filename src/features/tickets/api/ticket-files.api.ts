import { http } from '@/lib/api/http';
import {
  ticketFileSchema,
  ticketFilesSchema,
  type CreateTicketFileInput,
  type TicketFile,
} from '../schemas/ticket-file.schema';
import { ApiError } from '@/lib/api/errors';
import z from 'zod';

export type TicketFileSource = 'portal' | 'staff';

function filesPath(ticketId: string, source: TicketFileSource): string {
  if (source === 'staff') {
    return `/tickets/${ticketId}/files`;
  }
  return `/client-auth/tickets/${ticketId}/files`;
}

function deletePath(fileId: string, source: TicketFileSource): string {
  if (source === 'staff') {
    return `/ticket-files/${fileId}`;
  }
  return `/client-auth/ticket-files/${fileId}`;
}

export const fetchTicketFiles = (ticketId: string, source: TicketFileSource = 'portal') =>
  http.get(filesPath(ticketId, source), ticketFilesSchema);

export const createTicketFile = (
  ticketId: string,
  input: CreateTicketFileInput,
  source: TicketFileSource = 'portal',
) => http.post(filesPath(ticketId, source), ticketFileSchema, input);

export const deleteTicketFile = (fileId: string, source: TicketFileSource = 'portal') =>
  http.delete(deletePath(fileId, source), z.unknown());

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
export async function uploadTicketFile(
  ticketId: string,
  file: File,
  source: TicketFileSource = 'portal',
): Promise<TicketFile> {
  const created = await createTicketFile(
    ticketId,
    {
      filename: file.name,
      content_type: file.type as CreateTicketFileInput['content_type'],
      size: file.size,
    },
    source,
  );

  if (!created.upload_url) {
    throw new ApiError('Uploda URL missing', 0, 'INVALID_RESPONSE');
  }

  await putTicketObject(created.upload_url, file);

  return created;
}
