import type { LanguageShare } from '@/lib/github/types';
import text from '@/styles/text.module.css';
import styles from './LanguageBreakdown.module.css';

/** Darkest to lightest, by share. */
const COLORS = ['#1C1A17', '#5C5952', '#8E8B83', '#B9B6AE', '#D0CEC6'];
const colorAt = (i: number) => COLORS[i] ?? COLORS[COLORS.length - 1];

export function LanguageBreakdown({ languages, label }: { languages: LanguageShare[]; label: string }) {
  return (
    <div className={styles.languages}>
      <span className={text.label}>{label}</span>
      <div className={styles.bar}>
        {languages.map((l, i) => (
          <span key={l.name} className={styles.segment} style={{ flex: l.percent, background: colorAt(i) }} />
        ))}
      </div>
      <div className={styles.list}>
        {languages.map((l, i) => (
          <div key={l.name} className={styles.row}>
            <span className={styles.name}>
              <span className={styles.swatch} style={{ background: colorAt(i) }} />
              {l.name}
            </span>
            <span className={styles.percent}>{l.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
