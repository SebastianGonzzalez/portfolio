'use client';
import { useMarquee } from '@/hooks/useMarquee';
import { cx } from '@/lib/cx';
import type { ArchiveEntry } from '@/lib/github/types';
import text from '@/styles/text.module.css';
import styles from './ArchiveRow.module.css';

export interface ArchiveRowData extends ArchiveEntry {
  /** "01", "02"… */
  number: string;
  kind: string;
  /** CSS background for the thumbnail in the marquee; empty for repositories without one. */
  preview: string;
}

/** Repeats of the name in the marquee track; it scrolls by half its width, so the loop is seamless. */
const REPEATS = 8;

export function ArchiveRow({ row }: { row: ArchiveRowData }) {
  const { onEnter, onLeave } = useMarquee();
  return (
    <a
      href={`https://github.com/${row.repo}`}
      target="_blank"
      rel="noopener"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className={styles.row}
    >
      <span className={cx(text.label, styles.kind)}>
        <span className={styles.number}>{row.number}</span> · {row.kind}
      </span>
      <span className={styles.name}>{row.name}</span>
      <span className={cx(text.label, styles.meta)}>
        {row.language} · {row.year} ↗
      </span>
      <div data-mq="" aria-hidden="true" className={styles.overlay}>
        <div className={styles.overlayInner}>
          <div className={styles.track}>
            {Array.from({ length: REPEATS }, (_, r) => (
              <span key={r} className={styles.item}>
                <span className={cx(styles.name, styles.nameOnDark)}>{row.name}</span>
                {row.preview && <span className={styles.thumb} style={{ background: row.preview }} />}
                <span className={cx(text.label, text.onDark, styles.nowrap)}>{row.language}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}
