'use client';
import Link from 'next/link';
import { HOME_PATH, LANGS, type Dictionary, type Lang } from '@/content/i18n';
import { usePreferredLanguage } from '@/hooks/useUrlState';
import { rememberLanguage } from '@/lib/language-preference';
import styles from './LanguageHint.module.css';

interface LanguageHintProps {
  /** Language of the current page. */
  lang: Lang;
  /** Copy for each other language, written in that language. */
  copy: Partial<Record<Lang, Dictionary['languageHint']>>;
}

/**
 * Suggests the visitor's language when it isn't the page's. Never redirects: a static site can only
 * redirect after loading, which flashes, and some people prefer the other version anyway.
 * Following or dismissing the suggestion is remembered.
 */
export function LanguageHint({ lang, copy }: LanguageHintProps) {
  const preferred = usePreferredLanguage(LANGS);
  if (!preferred || preferred === lang) return null;
  const text = copy[preferred];
  if (!text) return null;

  return (
    <aside lang={preferred} aria-label={text.message} className={styles.hint}>
      <span className={styles.message}>{text.message}</span>
      <Link
        href={HOME_PATH[preferred]}
        hrefLang={preferred}
        onClick={() => rememberLanguage(preferred)}
        className={styles.action}
      >
        {text.action} →
      </Link>
      <button
        type="button"
        onClick={() => rememberLanguage(lang)}
        aria-label={text.dismiss}
        className={styles.dismiss}
      >
        <span aria-hidden="true">×</span>
      </button>
    </aside>
  );
}
