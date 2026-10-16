import type { Dictionary } from '@/content/i18n';
import { sectionId } from '@/content/sections';
import { Corners } from '@/components/ui/Corners';
import { Dim } from '@/components/ui/Dim';
import { Divider } from '@/components/ui/Divider';
import { Reveal } from '@/components/ui/Reveal';
import { cx } from '@/lib/cx';
import section from '@/styles/section.module.css';
import text from '@/styles/text.module.css';
import styles from './Approach.module.css';

export function Approach({ t, label }: { t: Dictionary['approach']; label: string }) {
  return (
    <section id={sectionId('approach')} data-stack="" className={cx(section.section, styles.approach)}>
      <Divider section="approach" label={label} />
      <Dim />
      <div className={styles.statements}>
        <Reveal className={cx(styles.statement, styles.outlined)}>
          <Corners />
          <span className={text.kicker}>{t.kicker}</span>
          <h2 className={styles.title}>{t.title}</h2>
          <p className={styles.body}>{t.body}</p>
        </Reveal>
        <Reveal className={cx(styles.statement, styles.statementDark)}>
          <span className={cx(text.kicker, text.onDark)}>{t.differenceKicker}</span>
          <h2 className={styles.title}>{t.differenceTitle}</h2>
          <p className={cx(styles.body, styles.bodyOnDark)}>{t.differenceBody}</p>
        </Reveal>
      </div>
      <Reveal className={styles.principles}>
        <span className={text.kicker}>{t.principlesKicker}</span>
        <div className={styles.grid}>
          {t.principles.map((p, i) => (
            <div key={p.title} className={styles.principle}>
              <span className={styles.index}>0{i + 1}</span>
              <h3 className={styles.principleTitle}>{p.title}</h3>
              <span className={styles.principleText}>{p.description}</span>
              <span className={styles.note}>→ {p.note}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
