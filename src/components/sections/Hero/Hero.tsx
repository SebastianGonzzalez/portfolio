'use client';
import { useRef } from 'react';
import { PROFILE } from '@/config/site';
import type { Dictionary } from '@/content/i18n';
import { sectionId } from '@/content/sections';
import { useHeroIntro } from '@/hooks/useHeroIntro';
import { useIsoStack } from '@/hooks/useIsoStack';
import { Dim } from '@/components/ui/Dim';
import { Shot } from '@/components/ui/Shot';
import text from '@/styles/text.module.css';
import { IsoStack } from './IsoStack';
import styles from './Hero.module.css';

const CONTACT_LINKS = [
  { label: 'GitHub', href: PROFILE.github.url },
  { label: 'WhatsApp', href: PROFILE.whatsapp.url },
  { label: 'Instagram', href: PROFILE.instagram.url },
];

export function Hero({ t }: { t: Dictionary['hero'] }) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const group = useRef<HTMLDivElement>(null);
  const iso = useIsoStack(stage, group);
  useHeroIntro(section, group, iso);

  return (
    <section ref={section} id={sectionId('top')} data-stack="" className={styles.hero}>
      <Dim />
      <div className={styles.intro}>
        <div data-intro="" className={styles.profile}>
          <div className={styles.avatar}>
            <Shot
              src={PROFILE.avatar}
              alt={PROFILE.name}
              placeholder="Foto"
              width={64}
              height={64}
              priority
            />
          </div>
          <div className={styles.identity}>
            <span className={styles.name} translate="no">
              {PROFILE.name}
            </span>
            <span className={styles.links}>
              {CONTACT_LINKS.map((l) => (
                <a key={l.label} className={styles.link} href={l.href} target="_blank" rel="noopener">
                  {l.label} ↗
                </a>
              ))}
              <a className={styles.link} href={`mailto:${PROFILE.email}`}>
                Email ↗
              </a>
            </span>
          </div>
        </div>
        <div data-intro="" className={text.kicker}>
          {t.kicker}
        </div>
        <h1 data-intro="" className={styles.title}>
          {t.title}
          <em className={styles.emphasis}>{t.titleEmphasis}</em>
        </h1>
        <p data-intro="" className={styles.lead}>
          {t.introBefore}
          <Chip mark="TS">TypeScript</Chip>, <Chip mark={'⚛\uFE0E'}>React</Chip>
          {t.introAnd}
          <Chip mark="N">Next.js</Chip>
          {t.introAfter}
        </p>
      </div>

      <div
        ref={stage}
        className={styles.stage}
        onPointerMove={iso.onPointerMove}
        onPointerLeave={iso.onPointerLeave}
      >
        <div className={styles.stageCaption}>
          <span className={styles.nowrap}>{t.stackKicker}</span>
          <span className={`hover-only ${styles.hint}`}>
            <span className={styles.hintRule} />
            {t.stackHint}
          </span>
        </div>
        <IsoStack ref={group} layers={t.layers} skillGroups={t.skillGroups} />
      </div>
    </section>
  );
}

/** Inline tech chip. Symbols that have an emoji form get \uFE0E, or Safari draws a colour emoji. */
function Chip({ mark, children }: { mark: string; children: string }) {
  return (
    <span className={styles.chip} translate="no">
      <span className={styles.chipMark}>{mark}</span>
      {children}
    </span>
  );
}
