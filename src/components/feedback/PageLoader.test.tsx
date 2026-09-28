import { renderWithProviders } from '@/test/render';
import { describe, expect, it } from 'vitest';
import { PageLoader } from './PageLoader';
import { screen } from '@testing-library/react';

describe('PageLoader', () => {
  it('exposes a status spinner for route and session waits', () => {
    renderWithProviders(<PageLoader />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading...');
  });
});
