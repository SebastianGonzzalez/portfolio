import { test as base, expect, type Page } from '@playwright/test';

export type Lang = 'es' | 'en';

// Same instant on every run: the footer clock and the contribution calendar depend on "now".
const NOW = new Date('2026-10-15T10:30:00-05:00');

// Offline and frozen in time: GitHub data falls back to the bundled snapshot and remote images to
// their placeholders, so every run renders the same page.
interface OpenOptions {
  /** Query string to append, e.g. "?caso=doose". */
  query?: string;
  /** navigator.languages. Defaults to the page's language, so no language suggestion shows. */
  browserLanguages?: string[];
}

export const test = base.extend<{ open: (lang?: Lang, options?: OpenOptions) => Promise<Page> }>({
  open: async ({ page }, use) => {
    await page.clock.setFixedTime(NOW);
    await page.route(/^https?:\/\/(?!localhost)/, (route) => route.abort());
    await use(async (lang = 'es', { query = '', browserLanguages = [lang] } = {}) => {
      await page.addInitScript((languages) => {
        Object.defineProperty(navigator, 'languages', { get: () => languages });
      }, browserLanguages);
      await page.goto((lang === 'es' ? './' : './en/') + query);
      await page.evaluate(() => document.fonts.ready);
      // Lazy images would otherwise start loading halfway through a full-page capture.
      await page.evaluate(() =>
        Promise.all(
          [...document.images].map((img) => {
            img.loading = 'eager';
            return img.decode().catch(() => undefined);
          }),
        ),
      );
      await page.waitForLoadState('networkidle');
      return page;
    });
  },
});

export { expect };
