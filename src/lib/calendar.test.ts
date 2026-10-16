import { describe, expect, it } from 'vitest';
import { es } from '@/content/i18n/es';
import { en } from '@/content/i18n/en';
import { LEVEL_COLORS, buildYear, isoDay, weekColumn } from './calendar';
import type { ContributionDay } from './github/types';

const TODAY = new Date(2026, 5, 15, 12);
// 2026-01-01 is a Thursday, so the first 4 cells belong to 2025.
const OFFSET = 4;
const build = (days: Record<string, ContributionDay> = {}, labels = es.github, locale = 'es') =>
  buildYear({ year: 2026, days, today: TODAY, locale, labels });
const cellOn = (year: ReturnType<typeof build>, month: number, day: number) =>
  year.cells[
    Math.round((new Date(2026, month, day).getTime() - new Date(2026, 0, 1).getTime()) / 864e5) + OFFSET
  ];
const day = (count: number, level = 1) => ({ count, level });

describe('buildYear', () => {
  it('lays out 53 week columns of 7 days', () => {
    expect(build().cells).toHaveLength(53 * 7);
  });

  it('counts contributions, active days and the longest streak up to today', () => {
    const year = build({
      '2026-01-01': day(2),
      '2026-01-02': day(1),
      '2026-01-03': day(5),
      '2026-01-05': day(1),
      '2026-07-01': day(9), // in the future: ignored
    });
    expect(year).toMatchObject({ total: 9, activeDays: 4, longestStreak: 3 });
  });

  it('leaves days of other years blank and marks the days still to come', () => {
    const year = build();
    expect(year.cells[0]).toMatchObject({ counted: false, future: false, tip: '' });
    expect(cellOn(year, 5, 16)).toMatchObject({ counted: false, future: true, tip: '' });
    expect(cellOn(year, 5, 15)).toMatchObject({ counted: true, future: false });
  });

  it('writes singular, plural and empty tooltips in the chosen language', () => {
    const days = { '2026-01-01': day(2), '2026-01-02': day(1) };
    const inSpanish = build(days),
      inEnglish = build(days, en.github, 'en');
    expect(cellOn(inSpanish, 0, 1).tip).toMatch(/^2 contribuciones · /);
    expect(cellOn(inSpanish, 0, 2).tip).toMatch(/^1 contribución · /);
    expect(cellOn(inSpanish, 0, 3).tip).toMatch(/^Sin contribuciones · /);
    expect(cellOn(inEnglish, 0, 1).tip).toMatch(/^2 contributions · /);
    expect(cellOn(inEnglish, 0, 2).tip).toMatch(/^1 contribution · /);
  });

  it('clamps the contribution level to the 1–4 scale', () => {
    const year = build({ '2026-01-01': day(3, 9), '2026-01-02': day(1, 0), '2026-01-03': day(0, 3) });
    expect([1, 2, 3].map((d) => cellOn(year, 0, d).level)).toEqual([4, 1, 0]);
  });

  it('places each month label on the week column where it starts', () => {
    const { months } = build({}, en.github, 'en');
    expect(months).toHaveLength(12);
    expect(months.slice(0, 2)).toEqual([
      { label: 'Jan', column: 1 },
      { label: 'Feb', column: 6 },
    ]);
  });
});

describe('calendar helpers', () => {
  it('formats local dates as YYYY-MM-DD', () => {
    expect(isoDay(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('finds the week column of a date', () => {
    expect(weekColumn(new Date(2026, 0, 1))).toBe(0);
    expect(weekColumn(new Date(2026, 0, 4))).toBe(1); // first Sunday starts week 2
  });

  it('has one color per level', () => {
    expect(LEVEL_COLORS).toHaveLength(5);
  });
});
