'use client';
import { useRef, type ReactNode } from 'react';
import { useStackedSections } from '@/hooks/useStackedSections';
import styles from './StackedSections.module.css';

/** Page body. Its `[data-stack]` sections pile up on each other while scrolling. */
export function StackedSections({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useStackedSections(ref);
  return (
    <main ref={ref} id="main" tabIndex={-1} className={styles.main}>
      {children}
    </main>
  );
}
