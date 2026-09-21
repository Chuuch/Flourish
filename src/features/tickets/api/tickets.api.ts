import { http } from '@/lib/api/http';
import {
  ticketSchema,
  ticketsSchema,
  type CreateTicketInput,
  type UpdateTicketInput,
} from '../schemas/ticket.schema';

export const fetchPortalTickets = () => http.get('/client-auth/tickets', ticketsSchema);

export const createPortalTicket = (input: CreateTicketInput) =>
  http.post('/client-auth/tickets', ticketSchema, input);

export const fetchStaffTickets = (clientId: string) =>
  http.get(`/clients/${clientId}/tickets`, ticketsSchema);

export const updateTicket = (ticketId: string, input: UpdateTicketInput) =>
  http.patch(`/tickets/${ticketId}`, ticketSchema, input);
