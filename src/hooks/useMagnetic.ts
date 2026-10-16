'use client';
import { useCallback, type PointerEvent } from 'react';
import { EASE_OUT } from '@/lib/motion';
import { useMotion } from '@/providers/MotionProvider';

const PULL = 0.32;

/** The `[data-mag]` child follows the cursor within the zone it is attached to, and springs back on leave. */
export function useMagnetic() {
  const { isActive } = useMotion();

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (!isActive()) return;
      const zone = e.currentTarget;
      const target = zone.querySelector<HTMLElement>('[data-mag]');
      if (!target) return;
      const r = zone.getBoundingClientRect(),
        s = r.width / zone.offsetWidth || 1;
      const dx = (e.clientX - (r.left + r.width / 2)) / s,
        dy = (e.clientY - (r.top + r.height / 2)) / s;
      target.style.transition = `transform 220ms ${EASE_OUT}`;
      target.style.transform = `translate(${dx * PULL}px, ${dy * PULL}px)`;
    },
    [isActive],
  );

  const onPointerLeave = useCallback((e: PointerEvent<HTMLElement>) => {
    const target = e.currentTarget.querySelector<HTMLElement>('[data-mag]');
    if (!target) return;
    target.style.transition = 'transform 700ms cubic-bezier(.34,1.56,.64,1)';
    target.style.transform = 'translate(0,0)';
  }, []);

  return { onPointerMove, onPointerLeave };
}
