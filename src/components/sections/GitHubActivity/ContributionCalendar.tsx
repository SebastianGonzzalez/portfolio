'use client';
import { useEffect, useMemo, useRef, type PointerEvent } from 'react';
import type { Dictionary, Lang } from '@/content/i18n';
import { useIsClient } from '@/hooks/useClientValue';
import { LEVEL_COLORS, buildYear, weekColumn, type CalendarYear } from '@/lib/calendar';
import { useGitHubActivity } from '@/providers/GitHubProvider';
import styles from './ContributionCalendar.module.css';

const CELL = 11;
const STEP = CELL + 3;

/** This year's calendar. Null on the server: it depends on "today" and the visitor's timezone. */
export function useCalendarYear(lang: Lang, t: Dictionary['github']): CalendarYear | null {
  const { days } = useGitHubActivity();
  const isClient = useIsClient();
  return useMemo(() => {
    if (!isClient) return null;
    const today = new Date();
    return buildYear({ year: today.getFullYear(), days, today, locale: lang, labels: t });
  }, [isClient, days, lang, t]);
}

export function ContributionCalendar({ year, t }: { year: CalendarYear | null; t: Dictionary['github'] }) {
  const { loadedAt } = useGitHubActivity();
  const scroller = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const tip = useRef<HTMLDivElement>(null);

  // On narrow screens the calendar scrolls: open it on the current weeks instead of January.
  const scrolledFor = useRef<number | null>(null);
  useEffect(() => {
    const el = scroller.current;
    if (!el || !year || scrolledFor.current === loadedAt || el.scrollWidth <= el.clientWidth) return;
    scrolledFor.current = loadedAt;
    el.scrollLeft = Math.max(0, weekColumn(new Date()) * STEP - el.clientWidth + STEP * 6);
  }, [year, loadedAt]);

  const showTip = (e: PointerEvent<HTMLDivElement>) => {
    const cell = e.target as HTMLElement;
    const label = cell.dataset?.tip,
      t = tip.current,
      w = wrap.current;
    if (!t || !w) return;
    if (!label) {
      t.style.opacity = '0';
      return;
    }
    const wr = w.getBoundingClientRect(),
      cr = cell.getBoundingClientRect(),
      s = wr.width / w.offsetWidth || 1;
    t.textContent = label;
    t.style.opacity = '1';
    const x = (cr.left - wr.left) / s + 6 - t.offsetWidth / 2,
      y = (cr.top - wr.top) / s - 34;
    t.style.transform = `translate(${Math.max(0, Math.min(w.offsetWidth - t.offsetWidth, x))}px, ${y}px)`;
  };
  const hideTip = () => {
    if (tip.current) tip.current.style.opacity = '0';
  };

  return (
    <>
      {/* Scrolls sideways on phones: focusable so it can be scrolled from the keyboard. */}
      <div ref={scroller} tabIndex={0} role="region" aria-label={t.kicker} className={styles.scroller}>
        <div ref={wrap} className={styles.wrap}>
          <div className={styles.months}>
            {year?.months.map((m) => (
              <span key={m.label} className={styles.month} style={{ gridColumn: m.column }}>
                {m.label}
              </span>
            ))}
          </div>
          <div
            role="img"
            aria-label={year ? `${year.total} ${t.total} · ${new Date().getFullYear()}` : t.total}
            onPointerOver={showTip}
            onPointerLeave={hideTip}
            className={styles.grid}
          >
            {year?.cells.map((c, i) => (
              <span
                // Fixed 371-cell grid: the position is the identity.
                key={i}
                data-tip={c.tip}
                className={styles.cell}
                style={{
                  background: c.counted ? LEVEL_COLORS[c.level] : 'transparent',
                  border: c.future ? '1px dashed #B4B1A9' : '0',
                }}
              />
            ))}
          </div>
          <div ref={tip} className={styles.tooltip} />
        </div>
      </div>
      <div className={styles.legend}>
        <span>{t.note}</span>
        <span className={styles.scale}>
          {t.less}
          {LEVEL_COLORS.map((color) => (
            <span key={color} className={styles.swatch} style={{ background: color }} />
          ))}
          {t.more}
        </span>
      </div>
    </>
  );
}
