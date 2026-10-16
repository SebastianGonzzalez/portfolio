'use client';
import { useEffect, useRef } from 'react';
import { PROFILE } from '@/config/site';
import { afterNextPaint } from '@/lib/motion';
import { useIntroSignal } from '@/providers/IntroProvider';
import { useMotion } from '@/providers/MotionProvider';
import styles from './Preloader.module.css';

const SEEN_KEY = 'sg3-intro';
const DURATION = 1200;

function seenThisSession() {
  try {
    return !!sessionStorage.getItem(SEEN_KEY);
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Storage blocked: the preloader will just play again next time.
  }
}

/**
 * Full-screen 000→100 counter on the first visit of a session, then it fades away and signals the hero
 * entrance. Later visits skip straight to the entrance; with motion off nothing animates.
 */
export function Preloader({ loading }: { loading: string }) {
  const { isActive } = useMotion();
  const intro = useIntroSignal();
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const hide = () => {
      el.style.display = 'none';
    };
    if (!isActive()) return hide();
    if (seenThisSession()) {
      hide();
      return afterNextPaint(() => intro.emit());
    }
    markSeen();

    const timers: ReturnType<typeof setTimeout>[] = [];
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / DURATION),
        eased = 1 - Math.pow(1 - k, 3);
      if (counter.current) counter.current.textContent = String(Math.round(eased * 100)).padStart(3, '0');
      if (bar.current) bar.current.style.transform = `scaleX(${eased})`;
      if (k < 1) {
        raf = requestAnimationFrame(step);
        return;
      }
      el.style.transition = 'opacity 600ms ease-out, filter 600ms ease-out';
      el.style.opacity = '0';
      el.style.filter = 'blur(8px)';
      timers.push(
        setTimeout(() => intro.emit(), 120),
        setTimeout(hide, 620),
      );
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, [isActive, intro]);

  return (
    <div ref={root} aria-hidden="true" className={styles.preloader}>
      <div className={styles.content}>
        <span className={styles.name}>{PROFILE.name}</span>
        <span className={styles.status}>
          <span>{loading}</span>
          <span ref={counter}>000</span>
        </span>
        <span className={styles.track}>
          <span ref={bar} className={styles.bar} />
        </span>
      </div>
    </div>
  );
}
