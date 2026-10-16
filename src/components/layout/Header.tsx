'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { PROFILE } from '@/config/site';
import { HOME_PATH, type Dictionary, type Lang } from '@/content/i18n';
import { SECTIONS, sectionId } from '@/content/sections';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { rememberLanguage } from '@/lib/language-preference';
import { cx } from '@/lib/cx';
import { useActiveSection } from '@/providers/ScrollStackProvider';
import styles from './Header.module.css';

interface HeaderProps {
  lang: Lang;
  sections: Dictionary['sections'];
  t: Dictionary['header'];
}

const OTHER: Record<Lang, Lang> = { es: 'en', en: 'es' };

export function Header({ lang, sections, t }: HeaderProps) {
  const active = useActiveSection();
  const ring = useRef<HTMLSpanElement>(null);
  useScrollProgress(ring);
  const other = OTHER[lang];

  return (
    <header className={styles.header}>
      <div className={styles.navSlot}>
        <nav aria-label={t.nav} className={cx(styles.pill, styles.glass)}>
          {SECTIONS.map((s, i) =>
            s.nav ? (
              <a key={s.id} href={`#${s.id}`} className={styles.navLink}>
                <span className={cx(styles.dot, active === i && styles.dotActive)} />
                <span className={styles.roller}>
                  <span className={styles.roll}>
                    <span>{sections[s.key]}</span>
                    <span aria-hidden="true">{sections[s.key]}</span>
                  </span>
                </span>
              </a>
            ) : null,
          )}
        </nav>
      </div>

      <a
        href="#top"
        aria-label={`${PROFILE.initials} · ${sections.top}`}
        className={cx(styles.badge, styles.glass)}
      >
        {PROFILE.initials}
        <span ref={ring} aria-hidden="true" className={styles.ring} />
      </a>

      <div className={styles.actions}>
        <div className={cx(styles.pill, styles.glass)}>
          {/* Accessible name keeps the visible "ES / EN" (WCAG 2.5.3); the inactive one stays ≥ 4.5:1. */}
          <Link
            href={HOME_PATH[other]}
            hrefLang={other}
            onClick={() => rememberLanguage(other)}
            className={styles.lang}
          >
            <span className={cx(styles.langOption, lang === 'es' && styles.langCurrent)}>ES</span>
            <span aria-hidden="true" className={styles.langSlash}>
              /
            </span>
            <span className={cx(styles.langOption, lang === 'en' && styles.langCurrent)}>EN</span>
            <span className="sr-only"> · {t.switchLanguage}</span>
          </Link>
          <a href={`#${sectionId('contact')}`} className={styles.talk}>
            {t.talk}
          </a>
        </div>
      </div>
    </header>
  );
}
