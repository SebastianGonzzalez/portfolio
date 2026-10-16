import { PROFILE } from '@/config/site';
import type { Lang } from '@/content/i18n';
import { cx } from '@/lib/cx';
import type { Commit } from '@/lib/github/types';
import text from '@/styles/text.module.css';
import styles from './CommitLog.module.css';

interface CommitLogProps {
  commits: Commit[];
  lang: Lang;
  /** Dates are formatted in the visitor's timezone, so only after hydration. */
  showDates: boolean;
}

/** `git log --oneline` of the latest commits; the newest is highlighted. */
export function CommitLog({ commits, lang, showDates }: CommitLogProps) {
  const day = (iso: string) => new Date(iso).toLocaleDateString(lang, { day: 'numeric', month: 'short' });
  return (
    <div className={styles.log} translate="no">
      <span className={text.label}>Commits · $ git log --oneline</span>
      <div className={styles.list}>
        {commits.map((c, i) => (
          <a
            key={c.hash + c.repo}
            href={`https://github.com/${PROFILE.github.user}/${c.repo}/commit/${c.hash}`}
            target="_blank"
            rel="noopener"
            className={cx(styles.commit, i === 0 && styles.latest)}
          >
            <span className={styles.rail}>
              <span className={styles.node} />
            </span>
            <span className={styles.hash}>{c.hash}</span>
            <span className={styles.message}>{c.message}</span>
            <span className={styles.repo}>
              {c.repo}
              {showDates ? ' · ' + day(c.date) : ''}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
