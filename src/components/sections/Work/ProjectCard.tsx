'use client';
import { useRef } from 'react';
import type { Dictionary, Lang } from '@/content/i18n';
import type { Project } from '@/content/projects';
import { FADE_UP } from '@/components/ui/fadeUp';
import { Corners } from '@/components/ui/Corners';
import { Shot } from '@/components/ui/Shot';
import { useEnterAnimation } from '@/hooks/useEnterAnimation';
import { cx } from '@/lib/cx';
import text from '@/styles/text.module.css';
import { CaseStudy } from './CaseStudy';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
  /** "01", "02"… */
  number: string;
  lang: Lang;
  t: Dictionary['work'];
  featured: boolean;
  onFeature(): void;
}

export function ProjectCard({ project, number, lang, t, featured, onFeature }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEnterAnimation(ref, FADE_UP);
  const copy = project.text[lang];
  const { credit } = project.image;

  return (
    <div ref={ref} data-reveal="" className={cx(styles.card, featured && styles.featured)}>
      <Corners />
      <div className={styles.shot}>
        {/* The name starts with the alt text, which is also the visible placeholder if the image fails (WCAG 2.5.3). */}
        <a
          href={project.site}
          target="_blank"
          rel="noopener"
          aria-label={`${copy.imageAlt} · demo`}
          className={styles.frame}
        >
          <Shot
            key={project.image.src}
            src={project.image.src}
            fallback={project.image.fallback}
            alt={copy.imageAlt}
            fit="contain"
            placeholder={copy.imageAlt}
            width={1282}
            height={770}
          />
        </a>
        {/* Outside the link: no nested <a>. Hidden by CSS once the photo has fallen back. */}
        {credit && (
          <span className={styles.credit}>
            Photo by{' '}
            <a href={`${credit.url}?${UNSPLASH_UTM}`} target="_blank" rel="noopener">
              {credit.name}
            </a>{' '}
            on{' '}
            <a href={`https://unsplash.com/?${UNSPLASH_UTM}`} target="_blank" rel="noopener">
              Unsplash
            </a>
          </span>
        )}
      </div>
      <div className={styles.body}>
        <div className={cx(text.label, styles.meta)}>
          <span>
            {number} · {copy.kind}
          </span>
          <span>{project.language}</span>
        </div>
        <div className={styles.heading}>
          <h3 className={styles.name} translate="no">
            {project.name}
          </h3>
          <span className={styles.description}>{copy.description}</span>
        </div>
        <div className={styles.chips} translate="no">
          {project.chips.map((chip) => (
            <span key={chip} className={styles.chip}>
              {chip}
            </span>
          ))}
        </div>
        <div className={styles.actions}>
          <a
            href={`https://github.com/${project.repo}`}
            target="_blank"
            rel="noopener"
            className={styles.repo}
          >
            {t.viewRepo} ↗
          </a>
          {!featured && (
            <button
              type="button"
              className={cx(text.label, styles.pick)}
              title={t.viewCaseTip}
              aria-label={`${t.viewCase}: ${project.name}`}
              onClick={onFeature}
            >
              {t.viewCase} →
            </button>
          )}
        </div>
      </div>
      {featured && <CaseStudy study={copy.case} t={t} />}
    </div>
  );
}

const UNSPLASH_UTM = 'utm_source=portfolio&utm_medium=referral';
