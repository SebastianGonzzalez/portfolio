'use client';
import { useRef } from 'react';
import { useVariableWeight } from '@/hooks/useVariableWeight';
import styles from './VariableWeight.module.css';

const LETTERS = ['H', 'o', 'l', 'a'];

/** "Hola." in a variable font; each letter gains weight as the cursor approaches. */
export function VariableWeight() {
  const box = useRef<HTMLDivElement>(null);
  const handlers = useVariableWeight(box);
  return (
    <div ref={box} className={styles.word} {...handlers}>
      {LETTERS.map((ch) => (
        <span key={ch} data-l="" className={styles.letter}>
          {ch}
        </span>
      ))}
      <span data-l="" className={styles.period}>
        .
      </span>
    </div>
  );
}
