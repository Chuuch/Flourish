import { useAuthStore } from '@/features/auth';
import { useComments } from '../hooks/useComments';
import { useDeleteComment } from '../hooks/useDeleteComment';
import { useUpdateComment } from '../hooks/useUpdateComment';
import { useState } from 'react';
import { Alert, Button } from '@/components/ui';
import { canDeleteComment, canEditComment } from '../schemas/comment.schema';

export function CommentList({ taskId }: { taskId: string }) {
  const userId = useAuthStore((state) => state.user?.id);
  const role = useAuthStore((state) => state.role);
  const { data, isPending, isError, error, refetch } = useComments(taskId);
  const updateComment = useUpdateComment(taskId);
  const deleteComment = useDeleteComment(taskId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  if (isPending) {
    return <p role="status">Loading comments...</p>;
  }

  if (isError) {
    return (
      <Alert>
        <p>Could not load comments: {error.message}</p>
        <button type="button" onClick={() => void refetch()}>
          Retry
        </button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p>No comments yet.</p>;
  }

  return (
    <>
      {updateComment.isError ? <Alert>{updateComment.error.message}</Alert> : null}
      {deleteComment.isError ? <Alert>{deleteComment.error.message}</Alert> : null}
      <ul>
        {data.map((comment) => (
          <li key={comment.id}>
            {editingId === comment.id ? (
              <>
                <label htmlFor={`edit-body-${comment.id}`}>Edit body</label>
                <textarea
                  id={`edit-body-${comment.id}`}
                  className="block rounded border px-2 py-1"
                  value={draft}
                  onChange={(event) => {
                    setDraft(event.currentTarget.value);
                  }}
                />
                <Button
                  type="submit"
                  disabled={updateComment.isPending || draft.length === 0}
                  onClick={() => {
                    updateComment.mutate(
                      { commentId: comment.id, input: { body: draft } },
                      {
                        onSuccess: () => {
                          setEditingId(null);
                        },
                      },
                    );
                  }}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <span>
                  {comment.user_id} - {comment.body}
                </span>
                {canEditComment(userId, comment) ? (
                  <Button
                    type="button"
                    onClick={() => {
                      setEditingId(comment.id);
                      setDraft(comment.body);
                    }}
                  >
                    Edit
                  </Button>
                ) : null}
                {canDeleteComment(userId, role, comment) ? (
                  <Button
                    type="button"
                    disabled={deleteComment.isPending}
                    onClick={() => {
                      deleteComment.mutate(comment.id);
                    }}
                  >
                    Delete
                  </Button>
                ) : null}
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
