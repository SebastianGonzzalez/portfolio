import type { Dictionary } from '@/content/i18n';
import type { CaseStudy as Study } from '@/content/projects';
import { cx } from '@/lib/cx';
import styles from './CaseStudy.module.css';

/** Problem → role → what was built → decisions → result, under the featured project. */
export function CaseStudy({ study, t }: { study: Study; t: Dictionary['work'] }) {
  return (
    <div className={styles.case}>
      <Entry label={t.caseProblem}>{study.problem}</Entry>
      <Entry label={t.caseRole}>{study.role}</Entry>
      <div className={cx(styles.entry, styles.wide)}>
        <span className={styles.key}>{t.caseBuilt}</span>
        <div className={styles.built}>
          {study.built.map((item) => (
            <div key={item} className={cx(styles.value, styles.builtItem)}>
              <span className={styles.arrow}>→</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <Entry label={t.caseDecisions}>{study.decisions}</Entry>
      <Entry label={t.caseResult}>{study.result}</Entry>
    </div>
  );
}

function Entry({ label, children }: { label: string; children: string }) {
  return (
    <div className={styles.entry}>
      <span className={styles.key}>{label}</span>
      <span className={styles.value}>{children}</span>
    </div>
  );
}
