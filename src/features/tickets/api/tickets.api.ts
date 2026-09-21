import { http } from '@/lib/api/http';
import { ticketSchema, ticketsSchema, type CreateTicketInput } from '../schemas/ticket.schema';

export const fetchPortalTickets = () => http.get('/client-auth/tickets', ticketsSchema);

export const createPortalTicket = (input: CreateTicketInput) =>
  http.post('/client-auth/tickets', ticketSchema, input);
