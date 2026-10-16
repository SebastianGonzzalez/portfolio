'use client';
import { useRef, useState, type MouseEvent } from 'react';
import { PROFILE } from '@/config/site';
import type { Dictionary } from '@/content/i18n';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useDockMagnification } from '@/hooks/useDockMagnification';
import { cx } from '@/lib/cx';
import text from '@/styles/text.module.css';
import styles from './ContactDock.module.css';
import { dockLinks, type DockLink } from './dockLinks';

export function ContactDock({ t }: { t: Dictionary['contact'] }) {
  const box = useRef<HTMLDivElement>(null);
  const magnification = useDockMagnification(box);
  const { copied, copy } = useCopyToClipboard();
  const [hovered, setHovered] = useState(-1);
  const links = dockLinks(t, copied);

  const onMouseLeave = () => {
    magnification.onMouseLeave();
    setHovered(-1);
  };

  const onClick = (link: DockLink) => (e: MouseEvent) => {
    if (!link.copies) return;
    e.preventDefault();
    void copy(PROFILE.email);
  };

  return (
    <div className={styles.dockArea}>
      <span className={cx(text.label, text.onDark)}>{t.dockKicker}</span>
      <div
        ref={box}
        className={styles.dock}
        onMouseMove={magnification.onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {links.map((link, i) => (
          <a
            key={link.label}
            data-dock=""
            href={link.href}
            target={link.external ? '_blank' : '_self'}
            rel="noopener"
            aria-label={link.label}
            onClick={onClick(link)}
            onMouseEnter={() => setHovered(i)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(-1)}
            className={styles.item}
          >
            <span className={cx(styles.tooltip, hovered === i && styles.tooltipVisible)}>{link.label}</span>
            <span
              aria-hidden="true"
              className={styles.icon}
              style={{ backgroundImage: `url(${link.icon})` }}
            />
          </a>
        ))}
      </div>
      <span aria-live="polite" className={styles.caption}>
        <Caption detail={links[hovered]?.detail} copied={copied} t={t} />
      </span>
    </div>
  );
}

/** Under the dock: the hovered link, the copy confirmation, or a hint for the input in use. */
function Caption({ detail, copied, t }: { detail?: string; copied: boolean; t: Dictionary['contact'] }) {
  if (detail) return detail;
  if (copied) return t.copied;
  return (
    <>
      <span className="hover-only">{t.dockHint}</span>
      <span className="touch-only">{t.dockTap}</span>
    </>
  );
}
