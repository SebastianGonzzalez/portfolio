import type { ContributionDay } from './github/types';

/** Gray ramp for contribution levels 0–4. */
export const LEVEL_COLORS = ['#CAC8C0', '#A6A39B', '#7A776F', '#4A4741', '#1C1A17'];

interface CalendarCell {
  /** Cell is part of the year and not in the future. */
  counted: boolean;
  count: number;
  level: number;
  future: boolean;
  /** Tooltip; empty for cells outside the year or in the future. */
  tip: string;
}

export interface CalendarYear {
  /** 53 week columns × 7 days, column by column. */
  cells: CalendarCell[];
  /** Month label and the 1-based week column where it starts. */
  months: { label: string; column: number }[];
  year: number;
  total: number;
  longestStreak: number;
  activeDays: number;
}

interface Labels {
  months: string[];
  contributionOne: string;
  contributionMany: string;
  contributionNone: string;
}

interface Options {
  year: number;
  days: Record<string, ContributionDay>;
  today: Date;
  locale: string;
  labels: Labels;
}

export const isoDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Local midnight of a "YYYY-MM-DD" day: the same calendar day in every timezone, unlike `new Date(iso)`. */
export function fromIsoDay(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function tipFor(count: number, date: string, labels: Labels) {
  if (!count) return `${labels.contributionNone} · ${date}`;
  return `${count} ${count === 1 ? labels.contributionOne : labels.contributionMany} · ${date}`;
}

function cellFor(date: Date, { year, days, today, locale, labels }: Options): CalendarCell {
  const blank = { counted: false, count: 0, level: 0, tip: '' };
  if (date.getFullYear() !== year) return { ...blank, future: false };
  if (date > today) return { ...blank, future: true };
  const day = days[isoDay(date)];
  const count = day?.count ?? 0;
  const level = count ? Math.min(4, Math.max(1, day?.level || 1)) : 0;
  const label = date.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  return { counted: true, count, level, future: false, tip: tipFor(count, label, labels) };
}

/** GitHub-style contribution calendar for one year, with totals up to `today`. */
export function buildYear(options: Options): CalendarYear {
  const { year, labels } = options;
  const jan1 = new Date(year, 0, 1);
  const offset = jan1.getDay();
  const cells: CalendarCell[] = [];
  let total = 0,
    streak = 0,
    longestStreak = 0,
    activeDays = 0;
  for (let i = 0; i < 53 * 7; i++) {
    const cell = cellFor(new Date(year, 0, 1 + i - offset), options);
    cells.push(cell);
    if (!cell.counted) continue;
    total += cell.count;
    if (cell.count) {
      activeDays++;
      streak++;
      longestStreak = Math.max(longestStreak, streak);
    } else streak = 0;
  }
  const months = labels.months.map((label, m) => {
    const dayOfYear = Math.round((new Date(year, m, 1).getTime() - jan1.getTime()) / 864e5);
    return { label, column: Math.floor((dayOfYear + offset) / 7) + 1 };
  });
  return { cells, months, year, total, longestStreak, activeDays };
}

/** Week column (0-based) that contains `date`, for scrolling the calendar to today. */
export function weekColumn(date: Date) {
  const jan1 = new Date(date.getFullYear(), 0, 1);
  return Math.floor((Math.round((date.getTime() - jan1.getTime()) / 864e5) + jan1.getDay()) / 7);
}
