import type { Dictionary } from './i18n/types';

export type SectionKey = keyof Dictionary['sections'];

interface SectionEntry {
  key: SectionKey;
  /** Anchor id. Kept in Spanish: it is part of shared URLs. */
  id: string;
  /** Listed in the header navigation. */
  nav: boolean;
}

/**
 * Page sections, top to bottom. The header nav, the "0X / 07" counters and the stacked-scroll effect
 * are all derived from this list: to add a section, add it here and render it in HomePage.
 */
export const SECTIONS: readonly SectionEntry[] = [
  { key: 'top', id: 'top', nav: false },
  { key: 'approach', id: 'enfoque', nav: true },
  { key: 'work', id: 'trabajo', nav: true },
  { key: 'github', id: 'github', nav: true },
  { key: 'lab', id: 'lab', nav: true },
  { key: 'archive', id: 'archivo', nav: false },
  { key: 'contact', id: 'contacto', nav: false },
];

const pad = (n: number) => String(n).padStart(2, '0');

export const sectionIndex = (key: SectionKey) => SECTIONS.findIndex((s) => s.key === key);
export const sectionId = (key: SectionKey) => SECTIONS[sectionIndex(key)].id;
/** "02" for the second section. */
export const sectionNumber = (key: SectionKey) => pad(sectionIndex(key) + 1);
export const SECTION_COUNT = pad(SECTIONS.length);
