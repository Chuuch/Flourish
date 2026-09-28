import type { Locale } from '../schemas/locale.schema';
import { type MessageKey, en } from './en';
import { bg } from './bg';
import { de } from './de';
import { it } from './it';
import { es } from './es';
import { fr } from './fr';
import { ru } from './ru';

export const catalogs: Record<Locale, Record<MessageKey, string>> = {
  en,
  bg,
  de,
  fr,
  es,
  it,
  ru,
};
