/** Replace {name} placeholders: fill('© {year}', { year: 2026 }) → '© 2026'. Unknown names are left as is. */
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in values ? String(values[name]) : match,
  );
}

/** 1 → '1st', 2 → '2nd', 3 → '3rd', 11 → '11th', 22 → '22nd'. */
export function englishOrdinal(n: number) {
  const teen = n % 100 >= 11 && n % 100 <= 13;
  const suffix = teen ? 'th' : (({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th');
  return `${n}${suffix}`;
}

/**
 * Current semester of a degree, counting two terms a year: term 1 is January–June, term 2 July–December.
 * `start` is the first term studied.
 */
export function semesterOf(start: { year: number; term: 1 | 2 }, date: Date) {
  const term = date.getMonth() >= 6 ? 2 : 1;
  return (date.getFullYear() - start.year) * 2 + (term - start.term) + 1;
}
