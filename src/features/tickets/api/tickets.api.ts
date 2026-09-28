import { http } from '@/lib/api/http';
import {
  ticketSchema,
  ticketsSchema,
  type ConverTicketInput,
  type CreateTicketInput,
  type UpdateTicketInput,
} from '../schemas/ticket.schema';
import { taskSchema } from '@/features/tasks/schemas/task.schema';
import z from 'zod';

export const fetchPortalTickets = () => http.get('/client-auth/tickets', ticketsSchema);

export const createPortalTicket = (input: CreateTicketInput) =>
  http.post('/client-auth/tickets', ticketSchema, input);

export const fetchStaffTickets = (clientId: string) =>
  http.get(`/clients/${clientId}/tickets`, ticketsSchema);

export const updateTicket = (ticketId: string, input: UpdateTicketInput) =>
  http.patch(`/tickets/${ticketId}`, ticketSchema, input);

export const convertTicket = (ticketId: string, input: ConverTicketInput) =>
  http.post(`/tickets/${ticketId}/convert`, taskSchema, input);

export const deleteTicket = (ticketId: string) => http.delete(`/tickets/${ticketId}`, z.unknown());
