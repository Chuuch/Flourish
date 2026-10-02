import { http } from '@/lib/api/http';
import { invoiceSchema, invoicesSchema } from '../schemas/invoice.schema';
import z from 'zod';

export const fetchInvoices = (clientId: string) =>
  http.get(`/clients/${clientId}/invoices`, invoicesSchema);

export const fetchInvoice = (invoiceId: string) =>
  http.get(`/invoices/${invoiceId}`, invoiceSchema);

export const createInvoice = (clientId: string, from: string, to: string) =>
  http.post(`/clients/${clientId}/invoices`, invoiceSchema, { from, to });

export const updateInvoice = (invoiceId: string, from: string, to: string) =>
  http.patch(`/invoices/${invoiceId}`, invoiceSchema, { from, to });

export const sendInvoice = (invoiceId: string) =>
  http.post(`/invoices/${invoiceId}/send`, invoiceSchema);

export const markInvoicePaid = (invoiceId: string) =>
  http.post(`/invoices/${invoiceId}/paid`, invoiceSchema);

export const deleteInvoice = (invoiceId: string) =>
  http.delete(`/invoices/${invoiceId}`, z.unknown());
