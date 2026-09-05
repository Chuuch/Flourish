import { describe, expect, it } from 'vitest';
import { router } from './router';
import { render, screen } from '@testing-library/react';
import { RouterProvider } from 'react-router';

describe('application router', () => {
  it('renders the home route', async () => {
    render(<RouterProvider router={router} />);
    expect(await screen.findByText('Flourish')).toBeInTheDocument();
  });
});
