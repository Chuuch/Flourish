import { useRef, useState } from 'react';
import { useUploadTicketFile } from '../hooks/useUploadTicketFile';
import { isAllowedTicketFile, MAX_TICKET_FILE_SIZE_BYTES } from '../schemas/ticket-file.schema';
import { Alert, Button } from '@/components/ui';
import type { TicketFileSource } from '../api/ticket-files.api';

export function CreateTicketFileForm({
  ticketId,
  source = 'portal',
}: {
  ticketId: string;
  source?: TicketFileSource;
}) {
  const uploadFile = useUploadTicketFile(ticketId, source);
  const inputRef = useRef<HTMLInputElement>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const file = inputRef.current?.files?.[0];
        if (!file) {
          setValidationError('File is required');
          return;
        }
        if (!isAllowedTicketFile(file)) {
          setValidationError('Unsupported file type');
          return;
        }
        if (file.size < 1 || file.size > MAX_TICKET_FILE_SIZE_BYTES) {
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
        <label htmlFor={`file-${ticketId}`}>Attachment</label>
        <input
          id={`file-${ticketId}`}
          ref={inputRef}
          type="file"
          accept=".pdf,.png,.jpeg,.webp,.txt,.zip,applicetion/pdf,image/png,image/jpeg,image/webp,text/plain,application/zip"
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
