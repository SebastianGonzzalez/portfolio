import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// jsdom has no layout, observers, Web Animations or canvas. Minimal stand-ins for what the components touch.
class Observer {
  constructor(public callback?: unknown) {}
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.assign(window, {
  IntersectionObserver: Observer,
  ResizeObserver: Observer,
  matchMedia: (media: string) => ({ matches: false, media, addEventListener() {}, removeEventListener() {} }),
  scrollTo: () => {},
  scrollBy: () => {},
});
Element.prototype.animate = function () {
  return { cancel() {}, play() {}, onfinish: null } as unknown as Animation;
};
Element.prototype.getAnimations = () => [];

/** 2D context that accepts every call and records method names; measureText makes each char 10px wide. */
export function fakeContext2d() {
  const calls: string[] = [];
  const base: Record<string | symbol, unknown> = {
    calls,
    letterSpacing: '0px',
    measureText: (s: string) => {
      const w = Array.from(String(s)).length * 10;
      return {
        width: w,
        actualBoundingBoxLeft: 0,
        actualBoundingBoxRight: w,
        actualBoundingBoxAscent: 8,
        actualBoundingBoxDescent: 2,
      };
    },
    createRadialGradient: () => ({ addColorStop() {} }),
  };
  return new Proxy(base, {
    get(target, key) {
      if (key in target || typeof key !== 'string') return target[key];
      return () => calls.push(key);
    },
  });
}

const contexts = new WeakMap<HTMLCanvasElement, ReturnType<typeof fakeContext2d>>();
HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement) {
  if (!contexts.has(this)) contexts.set(this, fakeContext2d());
  return contexts.get(this) as never;
} as never;

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
  sessionStorage.clear();
  localStorage.clear();
  // URL state (?caso=…) would otherwise leak between tests.
  window.history.replaceState(null, '', '/');
});
