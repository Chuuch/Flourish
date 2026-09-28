import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ListSkeleton } from './ListSkeleton';

describe('ListSkeleton', () => {
  it('keeps the loading label available to assistive tech', () => {
    render(<ListSkeleton label="Loading clients..." />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading clients...');
    expect(screen.getByRole('status').querySelectorAll('li')).toHaveLength(4);
  });
});
