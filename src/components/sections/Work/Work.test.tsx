import { act, fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { es } from '@/content/i18n/es';
import { PROJECTS } from '@/content/projects';
import {
  advance,
  mockRect,
  offline,
  prefersReducedMotion,
  renderWithProviders,
  useAnimationTimers,
} from '@/test/utils';
import { orderWithFeatured } from './order';
import { Work } from './Work';

const indexOf = (slug: string) => PROJECTS.findIndex((p) => p.slug === slug);
const DOOSE = indexOf('doose');
const GALLERY = indexOf('galeria-visual');
const [first] = PROJECTS;
const doose = PROJECTS[DOOSE];
const caseText = (i: number) => PROJECTS[i].text.es.case.problem;
const viewCase = (name: string) => screen.queryByRole('button', { name: `${es.work.viewCase}: ${name}` });

describe('Work', () => {
  beforeEach(() => {
    offline();
    prefersReducedMotion(true);
  });

  it('features the first project with its case study', () => {
    renderWithProviders(<Work lang="es" t={es.work} label={es.sections.work} />);
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(
      PROJECTS.map((p) => p.name),
    );
    expect(screen.getByText(caseText(0))).toBeTruthy();
    expect(viewCase(first.name)).toBeNull();
    expect(screen.getAllByRole('link', { name: `${es.work.viewRepo} ↗` })[0].getAttribute('href')).toBe(
      `https://github.com/${first.repo}`,
    );
  });

  it('features another project when its case is requested', () => {
    renderWithProviders(<Work lang="es" t={es.work} label={es.sections.work} />);
    fireEvent.click(viewCase(doose.name)!);
    expect(screen.getByText(caseText(DOOSE))).toBeTruthy();
    expect(screen.queryByText(caseText(0))).toBeNull();
    expect(screen.getAllByRole('heading', { level: 3 })[0].textContent).toBe(doose.name);
  });

  it('falls back to the GitHub preview if a screenshot fails to load', () => {
    renderWithProviders(<Work lang="es" t={es.work} label={es.sections.work} />);
    const img = screen.getByAltText(doose.text.es.imageAlt);
    fireEvent.error(img);
    expect(img.getAttribute('src')).toBe(doose.image.fallback);
    expect(img.closest('.shot')!.querySelector('[data-fallback]')).toBeTruthy();
  });

  it('orders projects with the featured one first', () => {
    expect(orderWithFeatured(2)).toEqual([2, 0, 1, 3]);
    expect(orderWithFeatured(0)).toEqual([0, 1, 2, 3]);
  });
});

describe('Work with motion', () => {
  beforeEach(() => {
    offline();
    prefersReducedMotion(false);
    useAnimationTimers();
  });

  it('fades the grid out, swaps the case, and scrolls it back into view', () => {
    const animations: { onfinish: (() => void) | null }[] = [];
    vi.spyOn(Element.prototype, 'animate').mockImplementation(() => {
      const a = { cancel: vi.fn(), play() {}, onfinish: null };
      animations.push(a);
      return a as unknown as Animation;
    });
    const scrollBy = vi.spyOn(window, 'scrollBy');
    const { container } = renderWithProviders(<Work lang="es" t={es.work} label={es.sections.work} />);
    mockRect(container.querySelector('.grid')!, { top: 20 });
    fireEvent.click(viewCase(doose.name)!);
    expect(screen.queryByText(caseText(DOOSE))).toBeNull(); // still fading out
    act(() => animations.at(-1)!.onfinish!());
    advance(40);
    expect(screen.getByText(caseText(DOOSE))).toBeTruthy();
    expect(scrollBy).toHaveBeenCalledWith({ top: -90, behavior: 'smooth' });
  });
});

describe('Work and the URL', () => {
  beforeEach(() => {
    offline();
    prefersReducedMotion(true);
  });

  it('records the featured case in the URL, and keeps the default URL clean', () => {
    renderWithProviders(<Work lang="es" t={es.work} label={es.sections.work} />);
    fireEvent.click(viewCase(doose.name)!);
    expect(window.location.search).toBe('?caso=doose');
    fireEvent.click(viewCase(first.name)!);
    expect(window.location.search).toBe('');
  });

  it('opens a shared link on its case', () => {
    window.history.replaceState(null, '', '/?caso=galeria-visual');
    renderWithProviders(<Work lang="es" t={es.work} label={es.sections.work} />);
    expect(screen.getAllByRole('heading', { level: 3 })[0].textContent).toBe(PROJECTS[GALLERY].name);
    expect(screen.getByText(caseText(GALLERY))).toBeTruthy();
  });

  it('follows back/forward navigation', () => {
    renderWithProviders(<Work lang="es" t={es.work} label={es.sections.work} />);
    act(() => {
      window.history.replaceState(null, '', '/?caso=doose');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(screen.getByText(caseText(DOOSE))).toBeTruthy();
  });

  it('falls back to the first project for unknown cases', () => {
    window.history.replaceState(null, '', '/?caso=nope');
    renderWithProviders(<Work lang="es" t={es.work} label={es.sections.work} />);
    expect(screen.getByText(caseText(0))).toBeTruthy();
  });
});
