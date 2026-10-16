'use client';
import { useRef } from 'react';
import { SECTION_COUNT, sectionNumber, type SectionKey } from '@/content/sections';
import { useEnterAnimation, type EnterAnimation } from '@/hooks/useEnterAnimation';
import styles from './Divider.module.css';

const SNAP = 'cubic-bezier(.76,0,.24,1)';
const lineOf = (el: HTMLElement) => el.querySelector<HTMLElement>('[data-line]')!;
const tabsOf = (el: HTMLElement) => el.querySelectorAll<HTMLElement>('[data-tab]');

// The dashed rule draws itself left to right, then the tabs unfold.
const DRAW: EnterAnimation = {
  startsVisible: (top, vh) => top < vh * 0.88,
  hide(el) {
    lineOf(el).style.transform = 'scaleX(0)';
    tabsOf(el).forEach((tab) => {
      tab.style.opacity = '0';
      tab.style.clipPath = 'inset(0 0 100% 0)';
    });
  },
  show(el) {
    const line = lineOf(el);
    line.style.transition = `transform 1100ms ${SNAP}`;
    line.style.transform = 'scaleX(1)';
    tabsOf(el).forEach((tab, i) => {
      const delay = `${550 + i * 200}ms`;
      tab.style.transition = `opacity 500ms ease-out ${delay}, clip-path 700ms ${SNAP} ${delay}`;
      tab.style.opacity = '1';
      tab.style.clipPath = 'inset(0 0 0 0)';
    });
  },
  observer: { rootMargin: '0px 0px -12% 0px' },
};

/** Dashed rule on top of a section with its "02 / 07 · Label" tab. */
export function Divider({ section, label }: { section: SectionKey; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEnterAnimation(ref, DRAW);
  return (
    <div ref={ref} data-divider="" aria-hidden="true" className={styles.divider}>
      <span data-line="" className={styles.line} />
      <span data-tab="" className={styles.tab}>
        <span className={styles.number}>{sectionNumber(section)}</span>
        <span>/ {SECTION_COUNT}</span>
        <span>{label}</span>
      </span>
      <span data-tab="" className={styles.tick} />
    </div>
  );
}
