import type { Locale } from '../schemas/locale.schema';
import { type MessageKey, en } from './en';
import { bg } from './bg';

export const catalogs: Record<Locale, Record<MessageKey, string>> = {
  en,
  bg,
};
