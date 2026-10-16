'use client';
import { useEffect, useRef } from 'react';
import type { Dictionary, Lang } from '@/content/i18n';
import { PROJECTS } from '@/content/projects';
import { sectionId } from '@/content/sections';
import { useSearchParam } from '@/hooks/useUrlState';
import { EASE_OUT, afterNextPaint } from '@/lib/motion';
import { readSearchParam, writeSearchParam } from '@/lib/url-state';
import { useMotion } from '@/providers/MotionProvider';
import { useScrollStackChannels } from '@/providers/ScrollStackProvider';
import { ProjectCard } from './ProjectCard';
import { orderWithFeatured } from './order';
import styles from './ProjectGrid.module.css';

/** Query parameter holding the featured project, so a case can be shared as a link: ?caso=doose */
const PARAM = 'caso';
const indexOf = (slug: string | null) =>
  Math.max(
    0,
    PROJECTS.findIndex((p) => p.slug === slug),
  );

export function ProjectGrid({ lang, t }: { lang: Lang; t: Dictionary['work'] }) {
  const { isActive } = useMotion();
  const { scrollRequest } = useScrollStackChannels();
  const featured = indexOf(useSearchParam(PARAM));
  const grid = useRef<HTMLDivElement>(null);
  const fadeOut = useRef<Animation | null>(null);

  // A shared link to a case opens the page on the Work section.
  useEffect(() => {
    const slug = readSearchParam(PARAM);
    if (slug && PROJECTS.some((p) => p.slug === slug)) scrollRequest.emit(sectionId('work'));
  }, [scrollRequest]);

  // Fade the grid out, swap the featured project, fade back in, and bring the new case into view.
  const feature = (index: number) => {
    const g = grid.current;
    const animate = isActive() && !!g?.animate;
    const commit = () => {
      // The first project is the default: keep its URL clean.
      writeSearchParam(PARAM, index === 0 ? null : PROJECTS[index].slug);
      afterNextPaint(() => {
        fadeOut.current?.cancel();
        fadeOut.current = null;
        if (!g) return;
        if (animate) {
          g.animate(
            [
              { opacity: 0, transform: 'translateY(14px)' },
              { opacity: 1, transform: 'none' },
            ],
            {
              duration: 420,
              easing: EASE_OUT,
            },
          );
        }
        const top = g.getBoundingClientRect().top;
        if (top < 70) window.scrollBy({ top: top - 110, behavior: animate ? 'smooth' : 'auto' });
      });
    };
    if (!animate) return commit();
    fadeOut.current = g!.animate(
      [
        { opacity: 1, transform: 'none' },
        { opacity: 0, transform: 'translateY(-6px)' },
      ],
      {
        duration: 150,
        easing: 'ease-in',
        fill: 'forwards',
      },
    );
    fadeOut.current.onfinish = commit;
  };

  return (
    <div ref={grid} className={styles.grid}>
      {orderWithFeatured(featured).map((i) => (
        <ProjectCard
          key={PROJECTS[i].repo}
          project={PROJECTS[i]}
          number={String(i + 1).padStart(2, '0')}
          lang={lang}
          t={t}
          featured={i === featured}
          onFeature={() => feature(i)}
        />
      ))}
    </div>
  );
}
