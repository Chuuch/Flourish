export const paths = {
  home: '/',
  login: '/login',
  register: '/register',
  acceptInvite: '/accept-invite',
  members: '/members',
  clients: '/clients',
  projects: '/projects',
  tasks: '/tasks',
  portal: '/portal',
  portalLogin: '/portal/login',
} as const;

export function clientProjectsPath(clientId: string): string {
  return `${paths.clients}/${clientId}/projects`;
}

export function clientUsersPath(clientId: string): string {
  return `${paths.clients}/${clientId}/users`;
}

export function clientTicketsPath(clientId: string): string {
  return `${paths.clients}/${clientId}/tickets`;
}

export function projectTasksPath(clientId: string, projectId: string): string {
  return `${paths.clients}/${clientId}/projects/${projectId}/tasks`;
}

export function projectFilesPath(clientId: string, projectId: string): string {
  return `${paths.clients}/${clientId}/projects/${projectId}/files`;
}

export function taskTimeEntriesPath(clientId: string, projectId: string, taskId: string): string {
  return `${paths.clients}/${clientId}/projects/${projectId}/tasks/${taskId}/time-entries`;
}

export function taskCommentsPath(clientId: string, projectId: string, taskId: string): string {
  return `${paths.clients}/${clientId}/projects/${projectId}/tasks/${taskId}/comments`;
}
