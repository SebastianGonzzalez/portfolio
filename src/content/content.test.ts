import { describe, expect, it } from 'vitest';
import { asset } from '@/config/site';
import { HOME_PATH, LANGS, getDictionary } from './i18n';
import { PROJECTS } from './projects';
import { SECTION_COUNT, SECTIONS, sectionId, sectionIndex, sectionNumber } from './sections';
import { SKILL_GROUPS } from './skills';

/** Every path to a leaf, with array lengths, so two dictionaries can be compared structurally. */
function shape(value: unknown, path = ''): string[] {
  if (Array.isArray(value))
    return [`${path}[${value.length}]`, ...value.flatMap((v, i) => shape(v, `${path}[${i}]`))];
  if (value && typeof value === 'object')
    return Object.entries(value).flatMap(([k, v]) => shape(v, `${path}.${k}`));
  return [path];
}

describe('dictionaries', () => {
  it('have exactly the same keys and list lengths in every language', () => {
    const [first, ...rest] = LANGS.map((l) => shape(getDictionary(l)));
    for (const other of rest) expect(other).toEqual(first);
  });

  it('have no empty strings', () => {
    for (const lang of LANGS) {
      const strings = JSON.stringify(getDictionary(lang)).match(/"[^"]*"/g) ?? [];
      expect(strings).not.toContain('""');
    }
  });

  it('label every skill group', () => {
    for (const lang of LANGS) expect(getDictionary(lang).hero.skillGroups).toHaveLength(SKILL_GROUPS.length);
  });

  it('give each language a home path', () => {
    expect(HOME_PATH).toEqual({ es: '/', en: '/en/' });
  });
});

describe('projects', () => {
  it.each(PROJECTS.map((p) => [p.name, p]))('%s is complete in every language', (_, project) => {
    expect(project.repo).toMatch(/^[\w.-]+\/[\w.-]+$/);
    for (const lang of LANGS) {
      const copy = project.text[lang];
      expect(copy.kind && copy.description && copy.imageAlt).toBeTruthy();
      expect(copy.case.built.length).toBeGreaterThan(0);
    }
  });

  it('have unique repositories', () => {
    expect(new Set(PROJECTS.map((p) => p.repo)).size).toBe(PROJECTS.length);
  });
});

describe('sections', () => {
  it('have unique anchors and a label in each language', () => {
    expect(new Set(SECTIONS.map((s) => s.id)).size).toBe(SECTIONS.length);
    for (const lang of LANGS)
      for (const s of SECTIONS) expect(getDictionary(lang).sections[s.key]).toBeTruthy();
  });

  it('derive numbers and anchors from their position', () => {
    expect(SECTION_COUNT).toBe('07');
    expect(sectionIndex('work')).toBe(2);
    expect(sectionNumber('work')).toBe('03');
    expect(sectionId('archive')).toBe('archivo');
  });
});

describe('asset', () => {
  it('prefixes public files with the base path', () => {
    expect(asset('/icons/mail.svg')).toBe('/icons/mail.svg'); // no basePath in tests
  });
});
