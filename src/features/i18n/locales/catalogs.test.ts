import { describe, expect, it } from 'vitest';
import { bg } from './bg';
import { en } from './en';

describe('catalogs', () => {
  it('keeps English and Bulgarian keys in sync', () => {
    expect(Object.keys(bg).sort()).toEqual(Object.keys(en).sort());
  });
});
