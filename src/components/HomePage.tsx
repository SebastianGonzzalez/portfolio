import { LANGS, getDictionary, type Lang } from '@/content/i18n';
import { Header } from '@/components/layout/Header';
import { LanguageHint } from '@/components/layout/LanguageHint';
import { Preloader } from '@/components/layout/Preloader';
import { SectionIndicator } from '@/components/layout/SectionIndicator';
import { StackedSections } from '@/components/layout/StackedSections';
import { Approach } from '@/components/sections/Approach/Approach';
import { Archive } from '@/components/sections/Archive/Archive';
import { Contact } from '@/components/sections/Contact/Contact';
import { GitHubActivity } from '@/components/sections/GitHubActivity/GitHubActivity';
import { Hero } from '@/components/sections/Hero/Hero';
import { Lab } from '@/components/sections/Lab/Lab';
import { Work } from '@/components/sections/Work/Work';
import { AppProviders } from '@/providers';
import styles from './HomePage.module.css';

/** The one-page portfolio in a given language. Section order must match SECTIONS in content/sections.ts. */
export function HomePage({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const labels = t.sections;
  // The language suggestion is written in the language it suggests.
  const hintCopy = Object.fromEntries(
    LANGS.filter((l) => l !== lang).map((l) => [l, getDictionary(l).languageHint]),
  );
  return (
    <AppProviders>
      <div className={styles.page}>
        <a href="#main" className={styles.skipLink}>
          {t.header.skipToContent}
        </a>
        <Preloader loading={t.preloader.loading} />
        <Header lang={lang} sections={labels} t={t.header} />
        <LanguageHint lang={lang} copy={hintCopy} />
        <StackedSections>
          <Hero t={t.hero} />
          <Approach t={t.approach} label={labels.approach} />
          <Work lang={lang} t={t.work} label={labels.work} />
          <GitHubActivity lang={lang} t={t.github} label={labels.github} />
          <Lab t={t.lab} label={labels.lab} />
          <Archive lang={lang} t={t.archive} label={labels.archive} />
          <Contact t={t.contact} label={labels.contact} />
        </StackedSections>
        <SectionIndicator sections={labels} />
      </div>
    </AppProviders>
  );
}
