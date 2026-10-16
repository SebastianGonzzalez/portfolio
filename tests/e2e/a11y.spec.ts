import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Lang } from './fixtures';

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

for (const lang of ['es', 'en'] as Lang[]) {
  test(`has no WCAG violations (${lang})`, async ({ open }) => {
    const page = await open(lang);
    const results = await new AxeBuilder({ page })
      .withTags(WCAG)
      // The "git log" watermark is aria-hidden decoration: WCAG 1.4.3 exempts it from contrast.
      .exclude('[aria-hidden="true"][class*="watermark"]')
      .analyze();
    expect(
      results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`),
    ).toEqual([]);
  });
}
