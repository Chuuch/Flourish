import { env } from '@/config/env';
import { renderWithProviders } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CreateUserForm } from './CreateUserForm';
import { screen } from '@testing-library/react';
import { server } from '@/test/server';
import { HttpResponse, http as mswHttp } from 'msw';
import { createUserSchema, type User } from '../schemas/user.schema';
import { makeUser } from '@/test/factories/user';
import { UsersPage } from '../pages/UsersPage';

const usersUrl = `${env.API_URL}/users`;

describe('CreateUserForm', () => {
  it('shows a validation error without calling the API', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateUserForm />);

    await user.type(screen.getByLabelText('Email'), 'not-an-email');
    await user.click(screen.getByRole('button', { name: 'Create user' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Enter a valid email address');
  });

  it('creates a user and refreshes the list', async () => {
    const user = userEvent.setup();
    const users: User[] = [];

    server.use(
      mswHttp.get(usersUrl, () => HttpResponse.json(users)),
      mswHttp.post(usersUrl, async ({ request }) => {
        const input = createUserSchema.parse(await request.json());
        const created = makeUser({ email: input.email });
        users.push(created);
        return HttpResponse.json(created, { status: 201 });
      }),
    );

    renderWithProviders(<UsersPage />);
    expect(await screen.findByText('No users yet.')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Email'), 'grace@example.com');
    await user.click(screen.getByRole('button', { name: 'Create user' }));

    expect(await screen.findByText('grace@example.com')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveValue('');
  });

  it('shows the server error message', async () => {
    const user = userEvent.setup();
    server.use(
      mswHttp.post(usersUrl, () =>
        HttpResponse.json({ message: 'Email already taken' }, { status: 409 }),
      ),
    );

    renderWithProviders(<CreateUserForm />);

    await user.type(screen.getByLabelText('Email'), 'taken@example.com');
    await user.click(screen.getByRole('button', { name: 'Create user' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Email already taken');
  });
});
