import { commentAuthorLabel } from '../lib/commentAuthor';
import { useAuthStore } from '@/features/auth';
import { useMembers } from '@/features/members';
import { memberLabel } from '@/features/members/schemas/member.schema';
import { useI18n } from '@/features/i18n';
import { formatDateTime } from '@/lib/formatDate';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { Alert, Button, TextArea } from '@/components/ui';
import { useState } from 'react';
import { canDeleteComment, canEditComment } from '../schemas/comment.schema';
import { useComments } from '../hooks/useComments';
import { useDeleteComment } from '../hooks/useDeleteComment';
import { useUpdateComment } from '../hooks/useUpdateComment';

export function CommentList({ taskId }: { taskId: string }) {
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const members = useMembers();
  const { data, isPending, isError, error, refetch } = useComments(taskId);
  const updateComment = useUpdateComment(taskId);
  const deleteComment = useDeleteComment(taskId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const { locale, t } = useI18n();

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

  const currentUserLabel = user
    ? memberLabel({ display_name: user.display_name, email: user.email })
    : undefined;

  return (
    <>
      {updateComment.isError ? <Alert>{updateComment.error.message}</Alert> : null}
      {deleteComment.isError ? <Alert>{deleteComment.error.message}</Alert> : null}
      <ul className="stack-list">
        {data.map((comment) => {
          const author = commentAuthorLabel({
            userId: comment.user_id,
            members: members.data ?? [],
            currentUserId: user?.id,
            currentUserLabel,
          });

          return (
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
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-ink text-xs font-semibold tracking-wide">{author}</span>
                      <time
                        className="text-muted text-xs tabular-nums"
                        dateTime={comment.created_at}
                      >
                        {formatDateTime(comment.created_at, locale)}
                      </time>
                    </div>
                    <p className="m-0 text-sm leading-relaxed">{comment.body}</p>
                  </div>
                  <div className="form-actions">
                    {canEditComment(user?.id, comment) ? (
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
                    {canDeleteComment(user?.id, role, comment) ? (
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
          );
        })}
      </ul>
    </>
  );
}
