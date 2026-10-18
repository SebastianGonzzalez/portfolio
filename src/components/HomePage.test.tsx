import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { es } from '@/content/i18n/es';
import { en } from '@/content/i18n/en';
import {
  advance,
  mockRect,
  offline,
  prefersReducedMotion,
  touchScreen,
  useAnimationTimers,
} from '@/test/utils';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  beforeEach(() => {
    prefersReducedMotion(true);
    offline();
  });

  it('renders the seven sections inside the main landmark', () => {
    render(<HomePage lang="es" />);
    const main = screen.getByRole('main');
    expect([...main.querySelectorAll('section[data-stack]')].map((s) => s.id)).toEqual([
      'top',
      'enfoque',
      'trabajo',
      'github',
      'lab',
      'archivo',
      'contacto',
    ]);
  });

  it('has one h1, a heading per section and project headings', () => {
    render(<HomePage lang="es" />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(es.hero.title + es.hero.titleEmphasis);
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(7);
    expect(screen.getByRole('heading', { level: 3, name: 'Casa Nua' })).toBeTruthy();
  });

  it('renders the English page from the English dictionary', () => {
    render(<HomePage lang="en" />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(en.hero.title + en.hero.titleEmphasis);
    expect(screen.getByRole('navigation', { name: en.header.nav })).toBeTruthy();
  });

  it('scrolls in-page links to the stacked section instead of jumping', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo');
    render(<HomePage lang="es" />);
    const nav = screen.getByRole('navigation', { name: es.header.nav });
    const notPrevented = fireEvent.click(
      within(nav).getByRole('link', { name: new RegExp(es.sections.work) }),
    );
    expect(notPrevented).toBe(false);
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
    // Links to anything else are left alone.
    fireEvent.click(screen.getByText(/Hecho a mano con Next.js/));
    expect(scrollTo).toHaveBeenCalledTimes(1);
  });

  it('leaves Cmd/Ctrl-clicks on in-page links to the browser', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo');
    render(<HomePage lang="es" />);
    const nav = screen.getByRole('navigation', { name: es.header.nav });
    const link = within(nav).getByRole('link', { name: new RegExp(es.sections.work) });
    expect(fireEvent.click(link, { ctrlKey: true })).toBe(true);
    expect(fireEvent.click(link, { metaKey: true })).toBe(true);
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('scrolls a shared case link to the Work section', () => {
    window.history.replaceState(null, '', '/?caso=doose');
    const scrollTo = vi.spyOn(window, 'scrollTo');
    render(<HomePage lang="es" />);
    expect(scrollTo).toHaveBeenCalledOnce();
  });

  it('starts with a skip link to the main content', () => {
    render(<HomePage lang="es" />);
    const skip = screen.getAllByRole('link')[0];
    expect(skip.textContent).toBe(es.header.skipToContent);
    expect(skip.getAttribute('href')).toBe('#main');
    expect(screen.getByRole('main').id).toBe('main');
  });

  it('removes its global listeners on unmount', () => {
    const removed = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<HomePage lang="es" />);
    unmount();
    expect(removed.mock.calls.map((c) => c[0])).toEqual(
      expect.arrayContaining(['scroll', 'resize', 'pointermove', 'pointerup']),
    );
  });
});

describe('HomePage stacked scroll', () => {
  beforeEach(() => {
    prefersReducedMotion(false);
    offline();
    sessionStorage.setItem('sg3-intro', '1'); // skip the preloader
    useAnimationTimers();
  });

  it('tilts and dims a section as the next one slides over it, and tracks the current section', () => {
    const { container } = render(<HomePage lang="es" />);
    const sections = [...container.querySelectorAll<HTMLElement>('section[data-stack]')];
    sections.forEach((s, i) => mockRect(s, { top: [0, 384][i] ?? 2000 }));
    fireEvent.scroll(window);
    advance(20);
    expect(sections[0].style.position).toBe('sticky');
    expect(sections[0].style.transform).toContain('rotateX(3.00deg)');
    expect(sections[0].querySelector<HTMLElement>(':scope > [data-dim]')!.style.opacity).toBe('0.15');
    // The header marks "Enfoque" as the current section.
    const nav = screen.getByRole('navigation', { name: es.header.nav });
    expect(
      within(nav)
        .getByRole('link', { name: new RegExp(es.sections.approach) })
        .querySelector('.dotActive'),
    ).toBeTruthy();
  });

  it('only dims on touch screens, where tilting a tall section flickers', () => {
    touchScreen();
    const { container } = render(<HomePage lang="es" />);
    const sections = [...container.querySelectorAll<HTMLElement>('section[data-stack]')];
    sections.forEach((s, i) => mockRect(s, { top: [0, 384][i] ?? 2000 }));
    fireEvent.scroll(window);
    advance(20);
    expect(sections[0].style.position).toBe('sticky');
    expect(sections[0].style.transform).toBe('');
    expect(sections[0].querySelector<HTMLElement>(':scope > [data-dim]')!.style.opacity).toBe('0.15');
  });
});
