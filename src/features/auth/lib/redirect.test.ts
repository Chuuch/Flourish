import { describe, expect, it } from 'vitest';
import { paths } from '@/app/router/paths';
import { redirectFrom } from './redirect';

describe('redirectFrom', () => {
  it('returns an internal path', () => {
    expect(redirectFrom({ from: { pathname: '/users' } })).toBe('/users');
  });

  it('rejects protocol-relative URLs', () => {
    expect(redirectFrom({ from: { pathname: '//evil.example' } })).toBe(paths.home);
  });

  it('rejects absolute URLs', () => {
    expect(redirectFrom({ from: { pathname: 'https://evil.example' } })).toBe(paths.home);
  });

  it('falls back when state is missing', () => {
    expect(redirectFrom(undefined)).toBe(paths.home);
  });
});
