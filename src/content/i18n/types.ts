import type { es } from './es';

export const LANGS = ['es', 'en'] as const;
export type Lang = (typeof LANGS)[number];

/** Spanish is the source of truth: every other language must provide exactly the same keys. */
export type Dictionary = typeof es;
