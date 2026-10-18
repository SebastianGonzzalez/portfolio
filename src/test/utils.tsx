import { act, render, type RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';
import { vi } from 'vitest';
import { AppProviders } from '@/providers';

/** Render inside the app's providers. */
export const renderWithProviders = (ui: ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AppProviders, ...options });

/** Emulate `prefers-reduced-motion`. */
export const prefersReducedMotion = (reduce: boolean) =>
  vi.stubGlobal('matchMedia', (media: string) => ({
    matches: reduce,
    media,
    addEventListener() {},
    removeEventListener() {},
  }));

/** Emulate a phone: a touch-first screen, motion allowed. */
export const touchScreen = () =>
  vi.stubGlobal('matchMedia', (media: string) => ({
    matches: media.includes('pointer: coarse'),
    media,
    addEventListener() {},
    removeEventListener() {},
  }));

/** GitHub unreachable: every request rejects. */
export const offline = () =>
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.reject(new Error('offline'))),
  );

/** Fake timers that also drive requestAnimationFrame and performance.now. */
export const useAnimationTimers = () =>
  vi.useFakeTimers({
    toFake: [
      'requestAnimationFrame',
      'cancelAnimationFrame',
      'performance',
      'setTimeout',
      'clearTimeout',
      'setInterval',
      'clearInterval',
      'Date',
    ],
  });

export const advance = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

/** Pretend an element has this box (jsdom lays nothing out). */
export const mockRect = (el: Element, rect: Partial<DOMRect>) =>
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    right: 0,
    bottom: 0,
    x: 0,
    y: 0,
    ...rect,
    toJSON() {},
  });

/** Collects IntersectionObservers created while active, to trigger them by hand. */
export function captureIntersectionObservers() {
  const observers: { callback: IntersectionObserverCallback; targets: Element[] }[] = [];
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      targets: Element[] = [];
      constructor(public callback: IntersectionObserverCallback) {
        observers.push(this);
      }
      observe(el: Element) {
        this.targets.push(el);
      }
      unobserve() {}
      disconnect() {
        this.targets = [];
      }
    },
  );
  const enter = (el: Element) => {
    const io = observers.find((o) => o.targets.includes(el));
    act(() => io?.callback([{ isIntersecting: true, target: el } as IntersectionObserverEntry], io as never));
  };
  const observed = (el: Element) => observers.some((o) => o.targets.includes(el));
  return { observers, enter, observed };
}
