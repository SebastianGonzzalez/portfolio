import type { ReactNode } from 'react';
import type { Dictionary } from '@/content/i18n';
import { sectionId } from '@/content/sections';
import { Dim } from '@/components/ui/Dim';
import { Divider } from '@/components/ui/Divider';
import { Reveal } from '@/components/ui/Reveal';
import { cx } from '@/lib/cx';
import section from '@/styles/section.module.css';
import text from '@/styles/text.module.css';
import { DragPlayground } from './DragPlayground';
import { MagneticButton } from './MagneticButton';
import { VariableWeight } from './VariableWeight';
import styles from './Lab.module.css';

export function Lab({ t, label }: { t: Dictionary['lab']; label: string }) {
  return (
    <section id={sectionId('lab')} data-stack="" className={section.section}>
      <Divider section="lab" label={label} />
      <Dim />
      <Reveal className={styles.head}>
        <span className={text.kicker}>{t.kicker}</span>
        <h2 className={cx(text.title, styles.title)}>{t.title}</h2>
      </Reveal>
      <Reveal className={styles.experiments}>
        <Experiment number="01" name={t.drag} note={t.dragNote} className={styles.wide}>
          <DragPlayground t={t} />
        </Experiment>
        <Experiment number="02" name={t.weight} note={t.weightNote} className={styles.narrow}>
          <VariableWeight />
        </Experiment>
        <Experiment
          number="03"
          name={t.magnetic}
          note={t.magneticNote}
          className={cx(styles.narrow, styles.dark)}
        >
          <MagneticButton t={t} />
        </Experiment>
      </Reveal>
    </section>
  );
}

interface ExperimentProps {
  number: string;
  name: string;
  note: string;
  className: string;
  children: ReactNode;
}

function Experiment({ number, name, note, className, children }: ExperimentProps) {
  return (
    <div className={cx(styles.experiment, className)}>
      <div className={cx(text.label, styles.experimentHead)}>
        <span>
          EXP-{number} · {name}
        </span>
        <span>{number}</span>
      </div>
      {children}
      <div className={styles.note}>{note}</div>
    </div>
  );
}
