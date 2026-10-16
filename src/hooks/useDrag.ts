'use client';
import {
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { EASE_OUT } from '@/lib/motion';
import { useMotion } from '@/providers/MotionProvider';

const ARROWS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};
const STEP = 10;
const FAST_STEP = 40;

interface Drag {
  el: HTMLElement;
  startX: number;
  startY: number;
  baseX: number;
  baseY: number;
  /** Visual / layout size ratio, so drags stay 1:1 inside scaled parents. */
  scale: number;
  x?: number;
  y?: number;
}

/**
 * Free dragging with pointer events and transforms, no dependencies. Any number of elements can share
 * one instance: the last one grabbed comes to the front. Positions persist in `data-tx` / `data-ty`.
 * Keyboard alternative: arrow keys move the focused element (Shift for bigger steps).
 */
export function useDrag() {
  const { isActive } = useMotion();
  const drag = useRef<Drag | null>(null);
  const moved = useRef(false);
  const topZ = useRef(10);

  const startDrag = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    moved.current = false;
    drag.current = {
      el,
      startX: e.clientX,
      startY: e.clientY,
      baseX: Number(el.dataset.tx) || 0,
      baseY: Number(el.dataset.ty) || 0,
      scale: el.getBoundingClientRect().width / el.offsetWidth || 1,
    };
    el.style.transition = 'box-shadow 160ms ease-out';
    el.style.zIndex = String(++topZ.current);
    el.style.cursor = 'grabbing';
    el.style.boxShadow = '0 16px 36px rgba(28,26,23,.2)';
    e.preventDefault();
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      const dx = (e.clientX - d.startX) / d.scale,
        dy = (e.clientY - d.startY) / d.scale;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved.current = true;
      d.x = d.baseX + dx;
      d.y = d.baseY + dy;
      // Lean into the direction of travel.
      const tilt = isActive() ? Math.max(-7, Math.min(7, (e.movementX || 0) * 0.6)) : 0;
      d.el.style.transform = `translate(${d.x}px,${d.y}px) rotate(${tilt}deg) scale(1.03)`;
    };
    const onUp = () => {
      const d = drag.current;
      if (!d) return;
      const x = d.x ?? d.baseX,
        y = d.y ?? d.baseY;
      d.el.dataset.tx = String(x);
      d.el.dataset.ty = String(y);
      d.el.style.transition = `transform 360ms ${EASE_OUT}, box-shadow 360ms ${EASE_OUT}`;
      d.el.style.transform = `translate(${x}px,${y}px)`;
      d.el.style.cursor = 'grab';
      d.el.style.boxShadow = '';
      drag.current = null;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [isActive]);

  const moveWithKeys = useCallback(
    (e: ReactKeyboardEvent<HTMLElement>) => {
      const direction = ARROWS[e.key];
      if (!direction) return;
      e.preventDefault(); // don't scroll the page
      const el = e.currentTarget,
        step = e.shiftKey ? FAST_STEP : STEP;
      const x = (Number(el.dataset.tx) || 0) + direction[0] * step;
      const y = (Number(el.dataset.ty) || 0) + direction[1] * step;
      el.dataset.tx = String(x);
      el.dataset.ty = String(y);
      el.style.zIndex = String(++topZ.current);
      el.style.transition = isActive() ? `transform 160ms ${EASE_OUT}` : '';
      el.style.transform = `translate(${x}px,${y}px)`;
    },
    [isActive],
  );

  /** True if the last press turned into a drag (its click should then be ignored). */
  const wasDragged = useCallback(() => moved.current, []);

  return { startDrag, moveWithKeys, wasDragged };
}
