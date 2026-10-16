import type { Dictionary, Lang } from '@/content/i18n';
import { sectionId } from '@/content/sections';
import { Dim } from '@/components/ui/Dim';
import { Divider } from '@/components/ui/Divider';
import { Reveal } from '@/components/ui/Reveal';
import section from '@/styles/section.module.css';
import text from '@/styles/text.module.css';
import { ProjectGrid } from './ProjectGrid';
import styles from './Work.module.css';

export function Work({ lang, t, label }: { lang: Lang; t: Dictionary['work']; label: string }) {
  return (
    <section id={sectionId('work')} data-stack="" className={section.section}>
      <Divider section="work" label={label} />
      <Dim />
      <Reveal className={section.head}>
        <div className={section.headText}>
          <span className={text.kicker}>{t.kicker}</span>
          <h2 className={styles.title}>{t.title}</h2>
        </div>
        <a href={`#${sectionId('archive')}`} className={styles.seeAll}>
          {t.seeAll} ↓
        </a>
      </Reveal>
      <ProjectGrid lang={lang} t={t} />
    </section>
  );
}
