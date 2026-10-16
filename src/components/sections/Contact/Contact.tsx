import { PROFILE } from '@/config/site';
import type { Dictionary } from '@/content/i18n';
import { sectionId } from '@/content/sections';
import { TechText } from '@/components/effects/TechText/TechText';
import { Divider } from '@/components/ui/Divider';
import { Reveal } from '@/components/ui/Reveal';
import { cx } from '@/lib/cx';
import section from '@/styles/section.module.css';
import text from '@/styles/text.module.css';
import { ContactDock } from './ContactDock';
import { LocalTime } from './LocalTime';
import styles from './Contact.module.css';

const SIGNATURE_STYLE = { position: 'absolute', inset: 0, fontFamily: 'var(--font-serif)' } as const;

export function Contact({ t, label }: { t: Dictionary['contact']; label: string }) {
  return (
    <section id={sectionId('contact')} data-stack="" className={cx(section.section, styles.contact)}>
      <Divider section="contact" label={label} />
      <Reveal className={styles.panel}>
        <div className={styles.pitch}>
          <span className={cx(text.kicker, text.onDark)}>{t.kicker}</span>
          <h2 className={styles.title}>
            {t.title}
            <em className={styles.emphasis}>{t.titleEmphasis}</em>
          </h2>
          <p className={styles.body}>{t.body}</p>
        </div>
        <ContactDock t={t} />
      </Reveal>
      <footer className={styles.footer}>
        <div className={styles.signature}>
          <TechText
            text={PROFILE.name}
            fontWeight={500}
            fontSize={240}
            letterSpacing={-0.03}
            color="#1C1A17"
            accentColor="#1C1A17"
            dashLength={4}
            dashGap={2}
            strokeWidth={1.2}
            specks={15}
            reveal="letter"
            reach={180}
            style={SIGNATURE_STYLE}
          />
        </div>
        <div className={styles.colophon}>
          <span>{t.footer}</span>
          <span>
            <LocalTime /> · {t.localTime}
          </span>
          <a href={`#${sectionId('top')}`} className={styles.top}>
            {t.backToTop}
          </a>
        </div>
      </footer>
    </section>
  );
}
