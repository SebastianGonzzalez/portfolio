'use client';
import { useState } from 'react';
import type { Dictionary } from '@/content/i18n';
import { useMagnetic } from '@/hooks/useMagnetic';
import styles from './MagneticButton.module.css';

export function MagneticButton({ t }: { t: Dictionary['lab'] }) {
  const [clicks, setClicks] = useState(0);
  const magnetic = useMagnetic();
  return (
    <div className={styles.zone} {...magnetic}>
      <div data-mag="">
        <button type="button" className={styles.button} onClick={() => setClicks((n) => n + 1)}>
          {t.touch}
        </button>
      </div>
      <span aria-live="polite" className={styles.count}>
        {clicks} {t.clicks}
      </span>
    </div>
  );
}
