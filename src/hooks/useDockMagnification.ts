'use client';
import { useEffect, useState, type MouseEvent, type RefObject } from 'react';
import { useMotion } from '@/providers/MotionProvider';

const SIZE = 52;
const GROWTH = 34;
const REACH = 150;

/** Plain controller: each `[data-dock]` item eases toward its target size with a damped spring. */
function createDockMagnifier(boxRef: RefObject<HTMLElement | null>, motionActive: () => boolean) {
  let pointerX: number | null = null;
  let springs: { size: number; velocity: number }[] = [];
  let raf = 0;

  const targetSize = (el: HTMLElement, scale: number) => {
    if (pointerX == null || !motionActive()) return SIZE;
    const r = el.getBoundingClientRect();
    const distance = Math.abs(pointerX - (r.left + r.width / 2)) / scale;
    return distance < REACH ? SIZE + (GROWTH * (Math.cos((distance / REACH) * Math.PI) + 1)) / 2 : SIZE;
  };

  const step = () => {
    raf = 0;
    const box = boxRef.current;
    if (!box) return;
    const items = [...box.querySelectorAll<HTMLElement>('[data-dock]')];
    const scale = box.getBoundingClientRect().width / box.offsetWidth || 1;
    if (springs.length !== items.length) springs = items.map(() => ({ size: SIZE, velocity: 0 }));
    let settling = false;
    items.forEach((el, i) => {
      const target = targetSize(el, scale);
      const s = springs[i];
      s.velocity = s.velocity * 0.62 + (target - s.size) * 0.28;
      s.size += s.velocity;
      if (Math.abs(target - s.size) > 0.15 || Math.abs(s.velocity) > 0.15) settling = true;
      el.style.width = el.style.height = s.size.toFixed(2) + 'px';
    });
    if (settling) raf = requestAnimationFrame(step);
  };

  const kick = () => {
    if (!raf) raf = requestAnimationFrame(step);
  };

  return {
    onMouseMove(e: MouseEvent) {
      pointerX = e.clientX;
      kick();
    },
    onMouseLeave() {
      pointerX = null;
      kick();
    },
    stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    },
  };
}

/** macOS-style dock: items grow near the cursor. */
export function useDockMagnification(boxRef: RefObject<HTMLElement | null>) {
  const { isActive } = useMotion();
  const [dock] = useState(() => createDockMagnifier(boxRef, isActive));
  useEffect(() => dock.stop, [dock]);
  return dock;
}
