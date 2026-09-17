export const paths = {
  home: '/',
  login: '/login',
  register: '/register',
  members: '/members',
  clients: '/clients',
  projects: '/projects',
  tasks: '/tasks',
} as const;

export function clientProjectsPath(clientId: string): string {
  return `${paths.clients}/${clientId}/projects`;
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
