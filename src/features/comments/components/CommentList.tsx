import { useAuthStore } from '@/features/auth';
import { useComments } from '../hooks/useComments';
import { useDeleteComment } from '../hooks/useDeleteComment';
import { useUpdateComment } from '../hooks/useUpdateComment';
import { useState } from 'react';
import { Alert, Button } from '@/components/ui';
import { canDeleteComment, canEditComment } from '../schemas/comment.schema';
import { useI18n } from '@/features/i18n';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';

export function CommentList({ taskId }: { taskId: string }) {
  const userId = useAuthStore((state) => state.user?.id);
  const role = useAuthStore((state) => state.role);
  const { data, isPending, isError, error, refetch } = useComments(taskId);
  const updateComment = useUpdateComment(taskId);
  const deleteComment = useDeleteComment(taskId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const { t } = useI18n();

  if (isPending) {
    return <ListSkeleton label={t('comments.loading')} />;
  }

  if (isError) {
    return (
      <Alert>
        <p>{t('comments.loadError', { message: error.message })}</p>
        <button type="button" onClick={() => void refetch()}>
          {t('common.retry')}
        </button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p>{t('comments.empty')}</p>;
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
                <label htmlFor={`edit-body-${comment.id}`}>{t('comments.editBody')}</label>
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
                  {t('common.save')}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                  }}
                >
                  {t('common.cancel')}
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
                    {t('common.edit')}
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
                    {t('common.delete')}
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
