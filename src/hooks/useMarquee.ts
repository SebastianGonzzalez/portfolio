'use client';
import { useCallback, useRef, type FocusEvent, type MouseEvent } from 'react';
import { EASE_OUT } from '@/lib/motion';
import { useMotion } from '@/providers/MotionProvider';

type RowEvent = MouseEvent<HTMLElement> | FocusEvent<HTMLElement>;

function slide(el: Element, from: string | null, to: string, duration: number) {
  let current = from || getComputedStyle(el).transform;
  if (!current || current === 'none') current = 'translateY(0)';
  el.getAnimations().forEach((a) => a.cancel());
  el.animate([{ transform: current }, { transform: to }], { duration, easing: EASE_OUT, fill: 'forwards' });
}

/**
 * Hover reveal for a row: a `[data-mq]` overlay slides in from the edge the cursor entered by (top half →
 * from above), with an endlessly scrolling track inside. Structure: [data-mq] > inner > track.
 */
export function useMarquee() {
  const { isActive } = useMotion();
  const loops = useRef(new WeakMap<Element, Animation>());

  const run = useCallback(
    (e: RowEvent, entering: boolean) => {
      const row = e.currentTarget;
      const overlay = row.querySelector('[data-mq]');
      if (!overlay) return;
      const inner = overlay.firstElementChild!,
        track = inner.firstElementChild!;
      const r = row.getBoundingClientRect();
      // Keyboard focus has no pointer position: treat it as entering from the top.
      const clientY = 'clientY' in e ? e.clientY : 0;
      const fromTop = !clientY || clientY - r.top < r.height / 2;
      const away = fromTop ? 'translateY(-101%)' : 'translateY(101%)';
      const counter = fromTop ? 'translateY(101%)' : 'translateY(-101%)';
      const duration = isActive() ? 600 : 0;
      if (!entering) {
        slide(overlay, null, away, duration);
        slide(inner, null, counter, duration);
        return;
      }
      slide(overlay, away, 'translateY(0)', duration);
      slide(inner, counter, 'translateY(0)', duration);
      let loop = loops.current.get(track);
      if (isActive() && !loop) {
        const half = track.scrollWidth / 2;
        loop = track.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }], {
          duration: Math.max(9000, (half / 80) * 1000),
          iterations: Infinity,
        });
        loops.current.set(track, loop);
      }
      loop?.play();
    },
    [isActive],
  );

  const onEnter = useCallback((e: RowEvent) => run(e, true), [run]);
  const onLeave = useCallback((e: RowEvent) => run(e, false), [run]);
  return { onEnter, onLeave };
}
