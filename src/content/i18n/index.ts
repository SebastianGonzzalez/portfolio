import { en } from './en';
import { es } from './es';
import type { Dictionary, Lang } from './types';

export type { Dictionary, Lang } from './types';
export { LANGS } from './types';

const DICTIONARIES: Record<Lang, Dictionary> = { es, en };

export const getDictionary = (lang: Lang): Dictionary => DICTIONARIES[lang];

/** Path of the home page in each language (relative to basePath). */
export const HOME_PATH: Record<Lang, string> = { es: '/', en: '/en/' };
