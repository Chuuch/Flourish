export const paths = {
  home: '/',
  login: '/login',
  register: '/register',
  members: '/members',
  clients: '/clients',
  projects: '/projects',
} as const;

export function clientProjectsPath(clientId: string): string {
  return `${paths.clients}/${clientId}/projects`;
}
