export const paths = {
  home: '/',
  login: '/login',
  register: '/register',
  acceptInvite: '/accept-invite',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  account: '/account',
  members: '/members',
  activity: '/activity',
  reports: '/reports',
  clients: '/clients',
  projects: '/projects',
  estimates: '/estimates',
  estimateIntakes: '/estimates/intakes',
  portal: '/portal',
  portalLogin: '/portal/login',
  portalAccount: '/portal/account',
  notifications: '/notifications',
  portalNotifications: '/portal/notifications',
  portalInvoices: '/portal/invoices',
} as const;

export function clientPath(clientId: string): string {
  return `${paths.clients}/${clientId}`;
}

export function clientProjectsPath(clientId: string): string {
  return `${paths.clients}/${clientId}/projects`;
}

export function clientUsersPath(clientId: string): string {
  return `${paths.clients}/${clientId}/users`;
}

export function clientTicketsPath(clientId: string): string {
  return `${paths.clients}/${clientId}/tickets`;
}

export function clientTicketPath(clientId: string, ticketId: string): string {
  return `${paths.clients}/${clientId}/tickets/${ticketId}`;
}

export function clientInvoicesPath(clientId: string): string {
  return `${paths.clients}/${clientId}/invoices`;
}

export function invoicePath(clientId: string, invoiceId: string): string {
  return `${paths.clients}/${clientId}/invoices/${invoiceId}`;
}

export function portalInvoicePath(invoiceId: string): string {
  return `${paths.portalInvoices}/${invoiceId}`;
}

export function projectPath(clientId: string, projectId: string): string {
  return `${paths.clients}/${clientId}/projects/${projectId}`;
}

export function projectTasksPath(clientId: string, projectId: string): string {
  return `${paths.clients}/${clientId}/projects/${projectId}/tasks`;
}

export function projectFilesPath(clientId: string, projectId: string): string {
  return `${paths.clients}/${clientId}/projects/${projectId}/files`;
}

export function estimatePath(estimateId: string): string {
  return `${paths.estimates}/${estimateId}`;
}

export function estimateNewPath(): string {
  return `${paths.estimates}/new`;
}

export function intakePath(token: string): string {
  return `/intake/${token}`;
}

export function estimatesIntakesPath(): string {
  return paths.estimateIntakes;
}

export function intakeDetailPath(intakeId: string): string {
  return `${paths.estimates}/intakes/${intakeId}`;
}

export function taskPath(clientId: string, projectId: string, taskId: string): string {
  return `${paths.clients}/${clientId}/projects/${projectId}/tasks/${taskId}`;
}

export function taskTimeEntriesPath(clientId: string, projectId: string, taskId: string): string {
  return `${paths.clients}/${clientId}/projects/${projectId}/tasks/${taskId}/time-entries`;
}

export function taskCommentsPath(clientId: string, projectId: string, taskId: string): string {
  return `${paths.clients}/${clientId}/projects/${projectId}/tasks/${taskId}/comments`;
}
