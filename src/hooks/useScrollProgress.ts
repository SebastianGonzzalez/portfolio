'use client';
import { useEffect, type RefObject } from 'react';

/** Paints page scroll progress (0 → 360°) on an element as a conic ring with a soft leading edge. */
export function useScrollProgress(ringRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    let raf = 0;
    const paint = () => {
      raf = 0;
      const ring = ringRef.current;
      if (!ring) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const d = p * 360;
      ring.style.background =
        p < 0.003
          ? 'none'
          : `conic-gradient(#1C1A17 0deg, #1C1A17 ${Math.max(0, d - 56).toFixed(1)}deg, #E5E5E3 ${Math.max(0, d - 12).toFixed(1)}deg, #1C1A17 ${d.toFixed(1)}deg, transparent ${d.toFixed(1)}deg)`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(raf);
    };
  }, [ringRef]);
}
