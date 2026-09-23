import { http } from '@/lib/api/http';
import {
  fileSchema,
  filesSchema,
  type CreateFileInput,
  type ProjectFile,
} from '../schemas/file.schema';
import { ApiError } from '@/lib/api/errors';
import z from 'zod';

export const fetchFiles = (projectId: string) =>
  http.get(`/projects/${projectId}/files`, filesSchema);

export const createFile = (projectId: string, input: CreateFileInput) =>
  http.post(`/projects/${projectId}/files`, fileSchema, input);

export const deleteFile = (fileId: string) => http.delete(`/files/${fileId}`, z.unknown());

export async function putObject(uploadUrl: string, file: File): Promise<void> {
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

export async function uploadProjectFile(projectId: string, file: File): Promise<ProjectFile> {
  const created = await createFile(projectId, {
    filename: file.name,
    content_type: file.type as CreateFileInput['content_type'],
    size: file.size,
  });

  if (!created.upload_url) {
    throw new ApiError('Upload URL missing', 0, 'INVALID_RESPONSE');
  }

  await putObject(created.upload_url, file);

  return created;
}
