import { http } from '@/lib/api/http';
import {
  ticketCommentSchema,
  ticketCommentsSchema,
  type CreateTicketCommentInput,
} from '../schemas/ticket-comment.schema';

export type TicketCommentSource = 'portal' | 'staff';

function commentsPath(ticketId: string, source: TicketCommentSource): string {
  if (source === 'staff') {
    return `/tickets/${ticketId}/comments`;
  }
  return `/client-auth/tickets/${ticketId}/comments`;
}

export const fetchTicketComments = (ticketId: string, source: TicketCommentSource = 'portal') =>
  http.get(commentsPath(ticketId, source), ticketCommentsSchema);

export const createTicketComment = (
  ticketId: string,
  input: CreateTicketCommentInput,
  source: TicketCommentSource = 'portal',
) => http.post(commentsPath(ticketId, source), ticketCommentSchema, input);
