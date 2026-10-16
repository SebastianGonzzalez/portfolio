'use client';
import { PROFILE } from '@/config/site';
import type { Dictionary, Lang } from '@/content/i18n';
import { sectionId } from '@/content/sections';
import { Corners } from '@/components/ui/Corners';
import { Dim } from '@/components/ui/Dim';
import { Divider } from '@/components/ui/Divider';
import { Reveal } from '@/components/ui/Reveal';
import { useIsClient } from '@/hooks/useClientValue';
import { cx } from '@/lib/cx';
import { useGitHubActivity } from '@/providers/GitHubProvider';
import section from '@/styles/section.module.css';
import text from '@/styles/text.module.css';
import { ContributionCalendar, useCalendarYear } from './ContributionCalendar';
import { CommitLog } from './CommitLog';
import { LanguageBreakdown } from './LanguageBreakdown';
import styles from './GitHubActivity.module.css';

interface GitHubActivityProps {
  lang: Lang;
  t: Dictionary['github'];
  label: string;
  /** Build day, "YYYY-MM-DD": the static HTML shows the calendar as of this day. */
  builtOn: string;
}

export function GitHubActivity({ lang, t, label, builtOn }: GitHubActivityProps) {
  const activity = useGitHubActivity();
  const isClient = useIsClient();
  const year = useCalendarYear(lang, t, builtOn);

  const stats = [
    { label: t.total, value: year.total.toLocaleString(lang) },
    { label: t.streak, value: year.longestStreak, unit: t.days },
    { label: t.active, value: year.activeDays, unit: t.days },
    { label: t.repos, value: activity.repoCount },
  ];

  return (
    <section id={sectionId('github')} data-stack="" className={cx(section.section, styles.github)}>
      <Divider section="github" label={label} />
      <Dim />
      <div aria-hidden="true" translate="no" className={styles.watermark}>
        git log
      </div>
      <Reveal className={cx(section.head, styles.head)}>
        <div className={section.headText}>
          <span className={text.kicker}>{t.kicker}</span>
          <h2 className={cx(text.title, styles.title)}>{t.title}</h2>
        </div>
        <a href={PROFILE.github.url} target="_blank" rel="noopener" className={styles.profile}>
          <span className={cx(styles.status, activity.live && styles.statusLive)} />@{PROFILE.github.user} ·{' '}
          {activity.live ? t.live : t.snapshot} ↗
        </a>
      </Reveal>
      <Reveal className={styles.panel}>
        <Corners />
        <div className={styles.stats}>
          {stats.map((s) => (
            <div key={s.label} className={styles.stat}>
              <span className={text.label}>{s.label}</span>
              <span className={styles.statValue}>
                {s.value}
                {s.unit && <span className={styles.statUnit}> {s.unit}</span>}
              </span>
            </div>
          ))}
        </div>
        <ContributionCalendar year={year} t={t} />
        <div className={styles.columns}>
          <LanguageBreakdown languages={activity.languages} label={t.languages} />
          <CommitLog commits={activity.commits} lang={lang} showDates={isClient} />
        </div>
      </Reveal>
    </section>
  );
}
