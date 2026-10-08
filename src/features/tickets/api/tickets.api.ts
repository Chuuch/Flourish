import { http } from '@/lib/api/http';
import { withIdempotencyKey } from '@/lib/api/idempotency';
import {
  ticketSchema,
  ticketsPageSchema,
  type ConverTicketInput,
  type CreateTicketInput,
  type UpdateTicketInput,
} from '../schemas/ticket.schema';
import { taskSchema } from '@/features/tasks/schemas/task.schema';
import z from 'zod';

const DEFAULT_LIMIT = 50;

type ListParams = { q?: string; cursor?: string; limit?: number };

function listParams(params?: ListParams) {
  return {
    limit: params?.limit ?? DEFAULT_LIMIT,
    ...(params?.q ? { q: params.q } : {}),
    ...(params?.cursor ? { cursor: params.cursor } : {}),
  };
}

export const fetchPortalTickets = (params?: ListParams) =>
  http.get('/client-auth/tickets', ticketsPageSchema, {
    params: listParams(params),
  });

export const createPortalTicket = (input: CreateTicketInput) =>
  http.post('/client-auth/tickets', ticketSchema, input, withIdempotencyKey());

export const fetchStaffTickets = (clientId: string, params?: ListParams) =>
  http.get(`/clients/${clientId}/tickets`, ticketsPageSchema, {
    params: listParams(params),
  });

export const updateTicket = (ticketId: string, input: UpdateTicketInput) =>
  http.patch(`/tickets/${ticketId}`, ticketSchema, input);

export const convertTicket = (ticketId: string, input: ConverTicketInput) =>
  http.post(`/tickets/${ticketId}/convert`, taskSchema, input, withIdempotencyKey());

export const deleteTicket = (ticketId: string) => http.delete(`/tickets/${ticketId}`, z.unknown());
