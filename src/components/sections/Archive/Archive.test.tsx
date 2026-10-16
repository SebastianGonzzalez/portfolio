import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { es } from '@/content/i18n/es';
import { en } from '@/content/i18n/en';
import { GITHUB_SNAPSHOT } from '@/lib/github/snapshot';
import { offline, prefersReducedMotion, renderWithProviders } from '@/test/utils';
import { Archive } from './Archive';
import { toRows } from './archiveRows';

describe('toRows', () => {
  it('numbers rows and enriches known projects with their kind and preview', () => {
    const entries = [
      {
        repo: 'SebastianGonzzalez/galeria-visual',
        name: 'Galería visual',
        language: 'TypeScript',
        year: '2026',
      },
      { repo: 'someone/else', name: 'Else', language: 'Go', year: '2025' },
      { repo: 'DuanGomez/Doose', name: 'Doose', language: 'SCSS', year: '2026' },
    ];
    const [galeria, , doose] = toRows(entries, 'es', es.archive.repository);
    expect(galeria).toMatchObject({ number: '01', kind: 'Experimento', language: 'TypeScript' });
    expect(galeria.preview).toContain('url(/assets/galeria-visual.png)');
    expect(galeria.preview).toContain('opengraph.githubassets.com');
    expect(doose).toMatchObject({ number: '03', kind: 'Sitio web' });
  });

  it('uses a generic kind and no preview for repositories the site does not describe', () => {
    const [row] = toRows(
      [{ repo: 'someone/else', name: 'Else', language: '—', year: '2025' }],
      'en',
      en.archive.repository,
    );
    expect(row).toMatchObject({ kind: 'Repository', preview: '' });
  });
});

describe('Archive', () => {
  beforeEach(() => {
    offline();
    prefersReducedMotion(false);
  });

  it('lists every repository with a count', () => {
    renderWithProviders(<Archive lang="es" t={es.archive} label={es.sections.archive} />);
    const count = String(GITHUB_SNAPSHOT.archive.length).padStart(2, '0');
    expect(screen.getByText(`${count} ${es.archive.count}`)).toBeTruthy();
    const links = screen.getAllByRole('link').filter((a) => a.classList.contains('row'));
    expect(links.map((a) => a.getAttribute('href'))).toEqual(
      GITHUB_SNAPSHOT.archive.map((a) => `https://github.com/${a.repo}`),
    );
  });

  it('slides the marquee in from the side the cursor entered, and out again', () => {
    const animate = vi.spyOn(Element.prototype, 'animate');
    renderWithProviders(<Archive lang="es" t={es.archive} label={es.sections.archive} />);
    const row = screen.getAllByRole('link').find((a) => a.classList.contains('row'))!;
    vi.spyOn(row, 'getBoundingClientRect').mockReturnValue({ top: 0, height: 100 } as DOMRect);
    fireEvent.mouseEnter(row, { clientY: 80 }); // bottom half
    const [overlayIn] = animate.mock.calls[0][0] as Keyframe[];
    expect(overlayIn.transform).toBe('translateY(101%)');
    expect(
      animate.mock.calls.some(
        ([frames, opts]) =>
          (opts as KeyframeAnimationOptions).iterations === Infinity &&
          (frames as Keyframe[])[1].transform === 'translateX(-50%)',
      ),
    ).toBe(true);
    animate.mockClear();
    fireEvent.mouseLeave(row, { clientY: 10 }); // leaves through the top
    expect((animate.mock.calls[0][0] as Keyframe[])[1].transform).toBe('translateY(-101%)');
  });

  it('opens the marquee on keyboard focus without animating when motion is off', () => {
    prefersReducedMotion(true);
    const animate = vi.spyOn(Element.prototype, 'animate');
    renderWithProviders(<Archive lang="es" t={es.archive} label={es.sections.archive} />);
    const row = screen.getAllByRole('link').find((a) => a.classList.contains('row'))!;
    fireEvent.focus(row);
    expect(animate.mock.calls.every(([, opts]) => (opts as KeyframeAnimationOptions).duration === 0)).toBe(
      true,
    );
    fireEvent.blur(row);
  });
});
