'use client';
import { PROFILE } from '@/config/site';
import type { Dictionary, Lang } from '@/content/i18n';
import { sectionId } from '@/content/sections';
import { Dim } from '@/components/ui/Dim';
import { Divider } from '@/components/ui/Divider';
import { Reveal } from '@/components/ui/Reveal';
import { useGitHubActivity } from '@/providers/GitHubProvider';
import section from '@/styles/section.module.css';
import text from '@/styles/text.module.css';
import { ArchiveRow } from './ArchiveRow';
import { toRows } from './archiveRows';
import styles from './Archive.module.css';

export function Archive({ lang, t, label }: { lang: Lang; t: Dictionary['archive']; label: string }) {
  const { archive } = useGitHubActivity();
  const rows = toRows(archive, lang, t.repository);

  return (
    <section id={sectionId('archive')} data-stack="" className={section.section}>
      <Divider section="archive" label={label} />
      <Dim />
      <Reveal className={section.head}>
        <div className={section.headText}>
          <span className={text.kicker}>{t.kicker}</span>
          <h2 className={text.title}>{t.title}</h2>
        </div>
        <div className={styles.summary}>
          <span>
            {String(rows.length).padStart(2, '0')} {t.count}
          </span>
          <a
            href={`${PROFILE.github.url}?tab=repositories`}
            target="_blank"
            rel="noopener"
            className={styles.all}
          >
            GitHub ↗
          </a>
        </div>
      </Reveal>
      <Reveal className={styles.list}>
        {rows.map((row) => (
          <ArchiveRow key={row.repo} row={row} />
        ))}
      </Reveal>
    </section>
  );
}
