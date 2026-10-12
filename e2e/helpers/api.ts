import { expect, type APIRequestContext } from '@playwright/test';
import { portalCredentials, staffCredentials } from './auth';

export function apiBaseUrl(): string {
  return process.env.E2E_API_URL ?? process.env.VITE_API_URL ?? 'http://localhost:8080/api/v1';
}

function idempotencyHeaders(): Record<string, string> {
  return { 'Idempotency-Key': crypto.randomUUID() };
}

type AuthBody = {
  access_token: string;
};

type ClientRow = {
  id: string;
  name: string;
};

type ProjectRow = {
  id: string;
  client_id: string;
  name: string;
};

type TicketRow = {
  id: string;
  title: string;
};

type PhaseRow = {
  id: string;
  name: string;
};

type TaskRow = {
  id: string;
  title: string;
  starts_on: string | null;
  due_on: string | null;
  phase_id: string | null;
};

export type ScheduleFixture = {
  clientId: string;
  projectId: string;
  projectName: string;
  taskTitle: string;
  startsOn: string;
  phaseName: string;
};

async function staffLoginApi(request: APIRequestContext): Promise<string> {
  const { email, password } = staffCredentials();
  const response = await request.post(`${apiBaseUrl()}/auth/login`, {
    data: { email, password },
  });
  expect(response.ok(), await response.text()).toBeTruthy();
  const body = (await response.json()) as AuthBody;
  return body.access_token;
}

async function portalLoginApi(request: APIRequestContext): Promise<string> {
  const { email, password } = portalCredentials();
  const response = await request.post(`${apiBaseUrl()}/client-auth/login`, {
    data: { email, password },
  });
  expect(response.ok(), await response.text()).toBeTruthy();
  const body = (await response.json()) as AuthBody;
  return body.access_token;
}

async function findNorthwindClient(request: APIRequestContext, token: string): Promise<ClientRow> {
  const response = await request.get(`${apiBaseUrl()}/clients`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { limit: 50 },
  });
  expect(response.ok(), await response.text()).toBeTruthy();
  const body = (await response.json()) as { items: ClientRow[] };
  const northwind = body.items.find((client) => client.name === 'Northwind');
  expect(
    northwind,
    'Northwind client missing — run Gorest seed (`go run ./cmd/seed -force`)',
  ).toBeTruthy();
  return northwind!;
}

/** Builds client/project/ticket/phases/scheduled task against a live API (uses seeded Northwind portal). */
export async function seedScheduleFixture(request: APIRequestContext): Promise<ScheduleFixture> {
  const stamp = Date.now();
  const projectName = `E2E Schedule ${stamp}`;
  const taskTitle = `Ship calendar ${stamp}`;
  const ticketTitle = `E2E ticket ${stamp}`;
  const today = new Date();
  const startsOn = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');

  const staffToken = await staffLoginApi(request);
  const client = await findNorthwindClient(request, staffToken);

  const projectResponse = await request.post(`${apiBaseUrl()}/clients/${client.id}/projects`, {
    headers: { Authorization: `Bearer ${staffToken}`, ...idempotencyHeaders() },
    data: { name: projectName, notes: 'Playwright schedule fixture' },
  });
  expect(projectResponse.ok(), await projectResponse.text()).toBeTruthy();
  const project = (await projectResponse.json()) as ProjectRow;

  const portalToken = await portalLoginApi(request);
  const ticketResponse = await request.post(`${apiBaseUrl()}/client-auth/tickets`, {
    headers: { Authorization: `Bearer ${portalToken}`, ...idempotencyHeaders() },
    data: {
      kind: 'feature',
      title: ticketTitle,
      body: 'Created by Playwright so convert seeds project phases.',
    },
  });
  expect(ticketResponse.ok(), await ticketResponse.text()).toBeTruthy();
  const ticket = (await ticketResponse.json()) as TicketRow;

  const convertResponse = await request.post(`${apiBaseUrl()}/tickets/${ticket.id}/convert`, {
    headers: { Authorization: `Bearer ${staffToken}`, ...idempotencyHeaders() },
    data: { project_id: project.id },
  });
  expect(convertResponse.ok(), await convertResponse.text()).toBeTruthy();

  const phasesResponse = await request.get(`${apiBaseUrl()}/projects/${project.id}/phases`, {
    headers: { Authorization: `Bearer ${staffToken}` },
  });
  expect(phasesResponse.ok(), await phasesResponse.text()).toBeTruthy();
  const phases = (await phasesResponse.json()) as PhaseRow[];
  expect(phases.length).toBeGreaterThan(0);
  const kickoff = phases.find((phase) => phase.name === 'Kickoff') ?? phases[0]!;

  const taskResponse = await request.post(`${apiBaseUrl()}/projects/${project.id}/tasks`, {
    headers: { Authorization: `Bearer ${staffToken}`, ...idempotencyHeaders() },
    data: {
      title: taskTitle,
      notes: 'Visible on the project month calendar',
      status: 'in_progress',
      phase_id: kickoff.id,
      starts_on: startsOn,
      due_on: startsOn,
    },
  });
  expect(taskResponse.ok(), await taskResponse.text()).toBeTruthy();
  const task = (await taskResponse.json()) as TaskRow;
  expect(task.starts_on).toBe(startsOn);

  return {
    clientId: client.id,
    projectId: project.id,
    projectName,
    taskTitle,
    startsOn,
    phaseName: kickoff.name,
  };
}
