import { useAuthStore } from '@/features/auth';
import { useUploadFIle } from '../hooks/useUploadFile';
import { useRef, useState } from 'react';
import { canManageFiles, isAllowedFile, MAX_FILE_SIZE_BYTES } from '../schemas/file.schema';
import { Alert, Button } from '@/components/ui';

export function CreateFileForm({ projectId }: { projectId: string }) {
  const role = useAuthStore((state) => state.role);
  const uploadFile = useUploadFIle(projectId);
  const inputRef = useRef<HTMLInputElement>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!canManageFiles(role)) {
    return null;
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const file = inputRef.current?.files?.[0];
        if (!file) {
          setValidationError('File is required');
          return;
        }
        if (!isAllowedFile(file)) {
          setValidationError('Unsupported file type');
          return;
        }
        if (file.size < 1 || file.size > MAX_FILE_SIZE_BYTES) {
          setValidationError('File is too large');
          return;
        }
        setValidationError(null);
        uploadFile.mutate(file, {
          onSuccess: () => {
            if (inputRef.current) {
              inputRef.current.value = '';
            }
          },
        });
      }}
      noValidate
    >
      <div>
        <label htmlFor="file">File</label>
        <input
          id="file"
          ref={inputRef}
          type="file"
          accept=".pdf,.png,.jpeg,.jpg,.webp,.txt,.zip,.application/pdf,image/png,image/jpeg,image/webp,text/plain,application/zip"
          className="block rounded border px-2 py-1"
        />
      </div>

      {validationError ? <p role="alert">{validationError}</p> : null}
      {uploadFile.isError ? <Alert>{uploadFile.error.message}</Alert> : null}

      <Button type="submit" disabled={uploadFile.isPending}>
        Upload
      </Button>
    </form>
  );
}
