import z from 'zod';

export const MAX_TICKET_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const allowedTicketContentTypes = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'text/plain',
  'application/zip',
] as const;

export const ticketFileSchema = z.object({
  id: z.string(),
  organization_id: z.string(),
  ticket_id: z.string(),
  uploaded_by: z.string(),
  filename: z.string().min(1),
  content_type: z.string(),
  size: z.int(),
  created_at: z.string(),
  updated_at: z.string(),
  upload_url: z.url().optional(),
  download_url: z.url().optional(),
});

export const ticketFilesSchema = z.array(ticketFileSchema);

export const createTicketFileInputSchema = z.object({
  filename: z.string().min(1).max(255),
  content_type: z.enum(allowedTicketContentTypes),
  size: z.int().min(1).max(MAX_TICKET_FILE_SIZE_BYTES),
});

export type TicketFile = z.infer<typeof ticketFileSchema>;
export type CreateTicketFileInput = z.infer<typeof createTicketFileInputSchema>;

export function isAllowedTicketFile(file: File): boolean {
  return allowedTicketContentTypes.some((type) => type === file.type);
}
