'use client';
import { useEffect, useRef } from 'react';
import type { Dictionary } from '@/content/i18n';
import { SECTION_COUNT, SECTIONS } from '@/content/sections';
import { cx } from '@/lib/cx';
import { EASE_OUT } from '@/lib/motion';
import { useMotion } from '@/providers/MotionProvider';
import { useActiveSection } from '@/providers/ScrollStackProvider';
import styles from './SectionIndicator.module.css';

/** Floating "03 / 07 ▬▬▬ Trabajo" pill. Decorative: the header nav carries the same information. */
export function SectionIndicator({ sections }: { sections: Dictionary['sections'] }) {
  const active = useActiveSection();
  const { isActive } = useMotion();
  const label = useRef<HTMLSpanElement>(null);
  const shown = useRef(active);

  // The label rolls up when the section changes.
  useEffect(() => {
    if (shown.current === active) return;
    shown.current = active;
    const el = label.current;
    if (el?.animate && isActive()) {
      el.animate(
        [
          { transform: 'translateY(100%)', opacity: 0 },
          { transform: 'translateY(0)', opacity: 1 },
        ],
        {
          duration: 420,
          easing: EASE_OUT,
        },
      );
    }
  }, [active, isActive]);

  return (
    <div aria-hidden="true" className={styles.indicator}>
      <span>
        <span className={styles.current}>{String(active + 1).padStart(2, '0')}</span> / {SECTION_COUNT}
      </span>
      <span className={styles.bars}>
        {SECTIONS.map((s, i) => (
          <span key={s.id} className={cx(styles.bar, i <= active && styles.barDone)} />
        ))}
      </span>
      <span className={styles.labelWindow}>
        <span ref={label} className={styles.label}>
          {sections[SECTIONS[active].key]}
        </span>
      </span>
    </div>
  );
}
