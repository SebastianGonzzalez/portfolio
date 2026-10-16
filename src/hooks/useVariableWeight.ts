'use client';
import { useCallback, useEffect, useRef, type PointerEvent, type RefObject } from 'react';

interface Letter {
  el: HTMLElement;
  cx: number;
  cy: number;
}

const RADIUS = 170;
const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** Each `[data-l]` letter in the box gets heavier (200 → 900) the closer the cursor is. */
export function useVariableWeight(boxRef: RefObject<HTMLElement | null>) {
  const letters = useRef<Letter[] | null>(null);
  const scale = useRef(1);
  const raf = useRef(0);

  // Letter centres are measured once per hover, not on every move.
  const measure = useCallback(() => {
    const box = boxRef.current;
    if (!box) return;
    scale.current = box.getBoundingClientRect().width / box.offsetWidth || 1;
    letters.current = [...box.querySelectorAll<HTMLElement>('[data-l]')].map((el) => {
      const r = el.getBoundingClientRect();
      return { el, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
    });
  }, [boxRef]);

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        if (!letters.current) measure();
        const radius = RADIUS * scale.current;
        for (const l of letters.current ?? []) {
          const t = Math.max(0, 1 - Math.hypot(x - l.cx, y - l.cy) / radius);
          l.el.style.fontWeight = String(Math.round(200 + 700 * smoothstep(t)));
        }
      });
    },
    [measure],
  );

  const onPointerLeave = useCallback(() => {
    cancelAnimationFrame(raf.current);
    letters.current?.forEach((l) => (l.el.style.fontWeight = ''));
    letters.current = null;
  }, []);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return { onPointerEnter: measure, onPointerMove, onPointerLeave };
}
