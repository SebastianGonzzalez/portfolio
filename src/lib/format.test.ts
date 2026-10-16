import { describe, expect, it } from 'vitest';
import { englishOrdinal, fill, semesterOf } from './format';

describe('fill', () => {
  it('replaces known placeholders and leaves the rest', () => {
    expect(fill('© {year} · {who} · {missing}', { year: 2026, who: 'SG' })).toBe('© 2026 · SG · {missing}');
  });
});

describe('englishOrdinal', () => {
  it.each([
    [1, '1st'],
    [2, '2nd'],
    [3, '3rd'],
    [4, '4th'],
    [11, '11th'],
    [12, '12th'],
    [13, '13th'],
    [21, '21st'],
    [22, '22nd'],
    [101, '101st'],
    [111, '111th'],
  ])('%i → %s', (n, expected) => expect(englishOrdinal(n)).toBe(expected));
});

describe('semesterOf', () => {
  const start = { year: 2025, term: 1 as const };

  it('counts two terms a year from the first one', () => {
    expect(semesterOf(start, new Date(2025, 2, 1))).toBe(1);
    expect(semesterOf(start, new Date(2025, 8, 1))).toBe(2);
    expect(semesterOf(start, new Date(2026, 3, 1))).toBe(3);
    expect(semesterOf(start, new Date(2026, 9, 15))).toBe(4);
  });

  it('switches terms in July', () => {
    expect(semesterOf(start, new Date(2026, 5, 30))).toBe(3);
    expect(semesterOf(start, new Date(2026, 6, 1))).toBe(4);
  });

  it('works when the degree started in the second term', () => {
    expect(semesterOf({ year: 2024, term: 2 }, new Date(2025, 2, 1))).toBe(2);
  });
});
