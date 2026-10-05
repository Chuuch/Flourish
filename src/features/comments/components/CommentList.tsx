import { useAuthStore } from '@/features/auth';
import { useComments } from '../hooks/useComments';
import { useDeleteComment } from '../hooks/useDeleteComment';
import { useUpdateComment } from '../hooks/useUpdateComment';
import { useState } from 'react';
import { Alert, Button, TextArea } from '@/components/ui';
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
        <Button type="button" variant="ghost" size="sm" onClick={() => void refetch()}>
          {t('common.retry')}
        </Button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return <p className="text-muted m-0 text-sm">{t('comments.empty')}</p>;
  }

  return (
    <>
      {updateComment.isError ? <Alert>{updateComment.error.message}</Alert> : null}
      {deleteComment.isError ? <Alert>{deleteComment.error.message}</Alert> : null}
      <ul>
        {data.map((comment) => (
          <li key={comment.id}>
            {editingId === comment.id ? (
              <div className="flex flex-col gap-3">
                <TextArea
                  id={`edit-body-${comment.id}`}
                  label={t('comments.editBody')}
                  value={draft}
                  onChange={(event) => {
                    setDraft(event.currentTarget.value);
                  }}
                />
                <div className="form-actions">
                  <Button
                    type="button"
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
                    variant="ghost"
                    onClick={() => {
                      setEditingId(null);
                    }}
                  >
                    {t('common.cancel')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-muted text-xs font-semibold tracking-wide uppercase">
                    {comment.user_id}
                  </span>
                  <p className="m-0 text-sm leading-relaxed">{comment.body}</p>
                </div>
                <div className="form-actions">
                  {canEditComment(userId, comment) ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
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
                      size="sm"
                      variant="danger"
                      disabled={deleteComment.isPending}
                      onClick={() => {
                        deleteComment.mutate(comment.id);
                      }}
                    >
                      {t('common.delete')}
                    </Button>
                  ) : null}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
