import z from 'zod';

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const allowedContentTypes = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'text/plain',
  'application/zip',
] as const;

export const fileSchema = z.object({
  id: z.uuid(),
  organization_id: z.string(),
  project_id: z.string(),
  uploaded_by: z.string(),
  filename: z.string().min(1),
  content_type: z.string(),
  size: z.number().int(),
  created_at: z.string(),
  updated_at: z.string(),
  upload_url: z.url().optional(),
  download_url: z.url().optional(),
});

export const filesSchema = z.array(fileSchema);

export const createFileInputSchema = z.object({
  filename: z.string().min(1).max(255),
  content_type: z.enum(allowedContentTypes),
  size: z.number().int().min(1).max(MAX_FILE_SIZE_BYTES),
});

export type ProjectFile = z.infer<typeof fileSchema>;
export type CreateFileInput = z.infer<typeof createFileInputSchema>;

export function canManageFiles(role: string | null | undefined): boolean {
  return role === 'owner' || role === 'admin';
}

export function isAllowedFile(file: File): boolean {
  return allowedContentTypes.some((type) => type === file.type);
}
