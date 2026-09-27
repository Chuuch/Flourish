import z from 'zod';

export const localeSchema = z.enum(['en', 'bg']);

export const locales = localeSchema.options;

export type Locale = z.infer<typeof localeSchema>;
