import { describe, expect, it } from 'vitest';
import { en } from './en';
import { locales } from '../schemas/locale.schema';
import { catalogs } from './catalogs';

describe('catalogs', () => {
  it('keeps every locale in sync with English', () => {
    for (const locale of locales) {
      expect(Object.keys(catalogs[locale]).sort()).toEqual(Object.keys(en).sort());
    }
  });
});
