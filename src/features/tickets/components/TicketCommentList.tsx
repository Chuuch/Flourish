import { Alert, Button, TextArea } from '@/components/ui';
import type { TicketCommentSource } from '../api/ticket-comments.api';
import { useTicketComments } from '../hooks/useTicketComments';
import {
  canMutateTicketComment,
  updateTicketCommentSchema,
  type TicketComment,
  type UpdateTicketCommentInput,
} from '../schemas/ticket-comment.schema';
import { useUpdateTicketComment } from '../hooks/useUpdateTicketComment';
import { useDeleteTicketComment } from '../hooks/useDeleteTicketComment';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/features/auth';
import { useI18n } from '@/features/i18n';
import { ListSkeleton } from '@/components/feedback/ListSkeleton';
import { commentAuthorLabel } from '@/features/comments/lib/commentAuthor';
import { membersQueries } from '@/features/members/api/members.queries';
import { memberLabel } from '@/features/members/schemas/member.schema';
import { formatDateTime } from '@/lib/formatDate';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { clientUsersQueries } from '@/features/clientusers/api/client-users.queries';

function TicketCommentEditForm({
  ticketId,
  source,
  comment,
  onCancel,
}: {
  ticketId: string;
  source: TicketCommentSource;
  comment: TicketComment;
  onCancel: () => void;
}) {
  const updateComment = useUpdateTicketComment(ticketId, source);
  const { t } = useI18n();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateTicketCommentInput>({
    resolver: zodResolver(updateTicketCommentSchema),
    values: { body: comment.body },
  });

  return (
    <div className="flex flex-col gap-3">
      {updateComment.isError ? <Alert>{updateComment.error.message}</Alert> : null}
      <form
        onSubmit={(event) =>
          void handleSubmit((input) => {
            updateComment.mutate(
              { commentId: comment.id, input },
              {
                onSuccess: () => {
                  onCancel();
                },
              },
            );
          })(event)
        }
        noValidate
      >
        <TextArea
          id={`ticket-comment-edit-${comment.id}`}
          label={t('comments.editBody')}
          error={errors.body?.message}
          {...register('body')}
        />

        <div className="form-actions">
          <Button type="submit" disabled={updateComment.isPending}>
            {t('common.save')}
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        </div>
      </form>
    </div>
  );
}

export function TicketCommentList({
  ticketId,
  clientId,
  source = 'portal',
}: {
  ticketId: string;
  clientId?: string | undefined;
  source?: TicketCommentSource;
}) {
  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  const isStaff = role === 'owner' || role === 'admin' || role === 'member';
  const members = useQuery({
    ...membersQueries.list(),
    enabled: isStaff,
  });
  const clientUsers = useQuery({
    ...clientUsersQueries.list(clientId ?? ''),
    enabled: Boolean(clientId) && isStaff,
  });
  const { data, isPending, error, isError, refetch } = useTicketComments(ticketId, source);
  const deleteComment = useDeleteTicketComment(ticketId, source);
  const [editingId, setEditingId] = useState<string | null>(null);
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

  const people =
    clientId && clientUsers.data
      ? clientUsers.data.map((entry) => ({
          user_id: entry.user_id,
          email: entry.email,
          display_name: '',
        }))
      : [];

  return (
    <>
      {deleteComment.isError ? <Alert>{deleteComment.error.message}</Alert> : null}
      <ul className="stack-list">
        {data.map((comment) => {
          const author = commentAuthorLabel({
            userId: comment.user_id,
            members: members.data ?? [],
            people,
            currentUserId: user?.id,
            currentUserLabel,
          });
          const canMutate = canMutateTicketComment(role, user?.id, comment.user_id);

          return (
            <li key={comment.id}>
              {editingId === comment.id ? (
                <TicketCommentEditForm
                  ticketId={ticketId}
                  source={source}
                  comment={comment}
                  onCancel={() => {
                    setEditingId(null);
                  }}
                />
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
                  {canMutate ? (
                    <div className="form-actions">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingId(comment.id);
                        }}
                      >
                        {t('common.edit')}
                      </Button>
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
                    </div>
                  ) : null}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
