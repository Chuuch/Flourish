import { renderWithProviders } from '@/test/render';
import { useAuthStore } from '@/features/auth';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { RootLayout } from './RootLayout';

const testOrg = {
  id: crypto.randomUUID(),
  name: 'Acme',
  created_at: '2026-09-11T11:12:20Z',
  updated_at: '2026-09-11T11:12:20Z',
};

function renderLayout() {
  return renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<div>page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('RootLayout', () => {
  it('shows the theme toggle for guests', () => {
    renderLayout();

    expect(screen.getByRole('button', { name: 'Use dark theme' })).toBeInTheDocument();
    expect(screen.getByText('page')).toBeInTheDocument();
  });

  it('shows the theme toggle when signed in', () => {
    useAuthStore
      .getState()
      .setSession({ id: crypto.randomUUID(), email: 'ada@example.com' }, 'token', testOrg, 'owner');

    renderLayout();

    expect(screen.getByRole('button', { name: 'Use dark theme' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
  });
});
