'use client';
import { useEffect, type RefObject } from 'react';
import { useMotion } from '@/providers/MotionProvider';

export interface EnterAnimation {
  /** Whether the element is already on screen at load (then it is left as rendered). */
  startsVisible(top: number, viewportHeight: number): boolean;
  /** Put the element in its hidden state. */
  hide(el: HTMLElement): void;
  /** Animate it in. Runs once. */
  show(el: HTMLElement): void;
  observer: IntersectionObserverInit;
}

/** Entrance animation for elements below the fold. With motion off, everything stays as rendered. */
export function useEnterAnimation(ref: RefObject<HTMLElement | null>, animation: EnterAnimation) {
  const { isActive } = useMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !isActive() || !('IntersectionObserver' in window)) return;
    if (animation.startsVisible(el.getBoundingClientRect().top, window.innerHeight)) return;
    animation.hide(el);
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      animation.show(el);
      io.disconnect();
    }, animation.observer);
    io.observe(el);
    return () => io.disconnect();
  }, [ref, isActive, animation]);
}
