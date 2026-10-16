'use client';
import { useEffect, type RefObject } from 'react';
import { EASE_OUT } from '@/lib/motion';
import { useIntroSignal } from '@/providers/IntroProvider';
import { useMotion } from '@/providers/MotionProvider';
import type { IsoStack } from './useIsoStack';

/**
 * Hero entrance: `[data-intro]` elements and the 3D stack start hidden and play in when the preloader
 * signals. The stack arrives exploded and settles layer by layer, top layer first.
 */
export function useHeroIntro(
  sectionRef: RefObject<HTMLElement | null>,
  groupRef: RefObject<HTMLElement | null>,
  iso: IsoStack,
) {
  const { isActive } = useMotion();
  const intro = useIntroSignal();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !isActive()) return;
    const items = [...section.querySelectorAll<HTMLElement>('[data-intro]')];
    const group = groupRef.current;
    const timers: ReturnType<typeof setTimeout>[] = [];

    items.forEach((el) => {
      el.style.opacity = '0';
      el.style.filter = 'blur(10px)';
      el.style.transform = 'translateY(18px)';
    });
    if (group) {
      group.style.opacity = '0';
      iso.setSpread(4);
      iso.apply();
    }

    const reveal = () => {
      items.forEach((el, i) => {
        const delay = `${i * 90}ms`;
        el.style.transition = `opacity 900ms ${EASE_OUT} ${delay}, filter 900ms ${EASE_OUT} ${delay}, transform 900ms ${EASE_OUT} ${delay}`;
        el.style.opacity = '1';
        el.style.filter = 'none';
        el.style.transform = 'none';
      });
      if (!group) return;
      group.style.transition = `opacity 900ms ease-out, transform 700ms ${EASE_OUT}`;
      group.style.opacity = '1';
      const layers = [...group.querySelectorAll<HTMLElement>('[data-z]')];
      layers.forEach((el) => {
        el.style.transition = `transform 1400ms ${EASE_OUT} ${300 + (4 - Number(el.dataset.z)) * 90}ms`;
      });
      timers.push(
        setTimeout(() => {
          iso.setSpread(0);
          iso.apply();
        }, 60),
        setTimeout(() => layers.forEach((el) => (el.style.transition = `transform 700ms ${EASE_OUT}`)), 2200),
      );
    };

    const unsubscribe = intro.subscribe(reveal, { replay: true });
    return () => {
      unsubscribe();
      timers.forEach(clearTimeout);
    };
  }, [sectionRef, groupRef, iso, isActive, intro]);
}
