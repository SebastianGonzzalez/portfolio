import { act, fireEvent, render, screen } from '@testing-library/react';
import { useEffect } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { es } from '@/content/i18n/es';
import { en } from '@/content/i18n/en';
import { AppProviders } from '@/providers';
import { useIntroSignal } from '@/providers/IntroProvider';
import { useScrollStackChannels } from '@/providers/ScrollStackProvider';
import {
  advance,
  offline,
  prefersReducedMotion,
  renderWithProviders,
  useAnimationTimers,
} from '@/test/utils';
import { Header } from './Header';
import { Preloader } from './Preloader';
import { SectionIndicator } from './SectionIndicator';

/** Exposes the scroll-stack setter so a test can move the "current section". */
const stack: { setActive(i: number): void } = { setActive: () => {} };
const setActive = (i: number) => stack.setActive(i);
function ActiveSectionDriver() {
  const channels = useScrollStackChannels();
  useEffect(() => {
    stack.setActive = channels.setActive;
  });
  return null;
}

describe('Header', () => {
  beforeEach(() => offline());

  it('links to the other language, keeping the visible label in the accessible name', () => {
    renderWithProviders(<Header lang="es" sections={es.sections} t={es.header} />);
    const link = screen.getByRole('link', { name: /^ES ?EN ?· Cambiar idioma/ });
    // next/link drops the trailing slash outside a Next build; the E2E suite checks the real URL.
    expect(link.getAttribute('href')).toMatch(/^\/en\/?$/);
    expect(link.getAttribute('hreflang')).toBe('en');
    expect(link.querySelector('.langCurrent')!.textContent).toBe('ES');
  });

  it('links back to Spanish from the English page', () => {
    renderWithProviders(<Header lang="en" sections={en.sections} t={en.header} />);
    expect(screen.getByRole('link', { name: /Switch language/ }).getAttribute('href')).toBe('/');
    expect(screen.getByRole('link', { name: 'SG · Home' })).toBeTruthy();
  });

  it('lists only the navigable sections and marks the current one', () => {
    render(
      <AppProviders>
        <ActiveSectionDriver />
        <Header lang="es" sections={es.sections} t={es.header} />
      </AppProviders>,
    );
    const links = screen.getAllByRole('link').filter((l) => l.closest('nav'));
    expect(links.map((l) => l.getAttribute('href'))).toEqual(['#enfoque', '#trabajo', '#github', '#lab']);
    expect(links.some((l) => l.querySelector('.dotActive'))).toBe(false);
    act(() => setActive(2));
    expect(links[1].querySelector('.dotActive')).toBeTruthy();
  });

  it('draws scroll progress on the badge ring', () => {
    useAnimationTimers();
    vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(2000 + window.innerHeight);
    renderWithProviders(<Header lang="es" sections={es.sections} t={es.header} />);
    const ring = screen.getByRole('link', { name: 'SG · Inicio' }).querySelector<HTMLElement>('.ring')!;
    expect(ring.style.background).toBe('none');
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(1000);
    fireEvent.scroll(window);
    advance(20);
    expect(ring.style.background).toContain('conic-gradient');
  });
});

describe('SectionIndicator', () => {
  it('shows the current section number, progress bars and label', () => {
    render(
      <AppProviders>
        <ActiveSectionDriver />
        <SectionIndicator sections={es.sections} />
      </AppProviders>,
    );
    const animate = vi.spyOn(Element.prototype, 'animate');
    act(() => setActive(2));
    const indicator = document.querySelector('.indicator')!;
    expect(indicator.textContent).toContain('03 / 07');
    expect(indicator.textContent).toContain(es.sections.work);
    expect(indicator.querySelectorAll('.barDone')).toHaveLength(3);
    expect(animate).toHaveBeenCalled(); // the label rolls in
  });
});

let introPlayed = 0;
function IntroCounter() {
  const intro = useIntroSignal();
  useEffect(() => intro.subscribe(() => introPlayed++), [intro]);
  return null;
}

describe('Preloader', () => {
  beforeEach(() => {
    introPlayed = 0;
    prefersReducedMotion(false);
    useAnimationTimers();
  });

  const mount = () =>
    renderWithProviders(
      <>
        <IntroCounter />
        <Preloader loading={es.preloader.loading} />
      </>,
    );

  it('counts to 100, fades out in under a second and starts the intro, once per session', () => {
    const first = mount();
    const overlay = first.container.querySelector<HTMLElement>('.preloader')!;
    advance(200);
    expect(Number(overlay.textContent!.match(/\d{3}/)![0])).toBeGreaterThan(0);
    advance(700);
    expect(overlay.textContent).toContain('100');
    expect(overlay.style.display).toBe('none');
    expect(introPlayed).toBeGreaterThan(0);
    expect(sessionStorage.getItem('sg3-intro')).toBe('1');
    first.unmount();

    introPlayed = 0;
    const again = mount();
    expect(again.container.querySelector<HTMLElement>('.preloader')!.style.display).toBe('none');
    advance(40);
    expect(introPlayed).toBeGreaterThan(0);
  });

  it('stays out of the way with reduced motion', () => {
    prefersReducedMotion(true);
    const { container } = mount();
    expect(container.querySelector<HTMLElement>('.preloader')!.style.display).toBe('none');
    advance(3000);
    expect(introPlayed).toBe(0);
  });

  it('plays even if session storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const { container } = mount();
    advance(2000);
    expect(container.querySelector<HTMLElement>('.preloader')!.style.display).toBe('none');
  });

  it('stops its timers on unmount', () => {
    const { unmount } = mount();
    advance(470); // the count is done, the intro not yet started
    unmount();
    advance(1000);
    expect(introPlayed).toBe(0);
  });
});
