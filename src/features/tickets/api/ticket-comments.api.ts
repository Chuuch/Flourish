import { http } from '@/lib/api/http';
import {
  ticketCommentSchema,
  ticketCommentsSchema,
  type CreateTicketCommentInput,
  type UpdateTicketCommentInput,
} from '../schemas/ticket-comment.schema';
import z from 'zod';

export type TicketCommentSource = 'portal' | 'staff';

function commentsPath(ticketId: string, source: TicketCommentSource): string {
  if (source === 'staff') {
    return `/tickets/${ticketId}/comments`;
  }
  return `/client-auth/tickets/${ticketId}/comments`;
}

function commentPath(commentId: string, source: TicketCommentSource): string {
  if (source === 'staff') {
    return `/ticket-comments/${commentId}`;
  }
  return `/client-auth/ticket-comments/${commentId}`;
}

export const fetchTicketComments = (ticketId: string, source: TicketCommentSource = 'portal') =>
  http.get(commentsPath(ticketId, source), ticketCommentsSchema);

export const createTicketComment = (
  ticketId: string,
  input: CreateTicketCommentInput,
  source: TicketCommentSource = 'portal',
) => http.post(commentsPath(ticketId, source), ticketCommentSchema, input);

export const updateTicketComment = (
  commentId: string,
  input: UpdateTicketCommentInput,
  source: TicketCommentSource = 'portal',
) => http.patch(commentPath(commentId, source), ticketCommentSchema, input);

export const deleteTicketComment = (commentId: string, source: TicketCommentSource = 'portal') =>
  http.delete(commentPath(commentId, source), z.unknown());
