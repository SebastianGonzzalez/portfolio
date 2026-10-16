import { expect, test, type Lang } from './fixtures';

// Pixel-level guard for refactors: the page must look exactly like the approved baseline.
for (const lang of ['es', 'en'] as Lang[]) {
  test(`full page matches the baseline (${lang})`, async ({ open }) => {
    const page = await open(lang);
    // The footer's canvas lettering redraws on its own clock; its behaviour is covered by unit tests.
    await expect(page).toHaveScreenshot(`home-${lang}.png`, {
      fullPage: true,
      mask: [page.locator('canvas')],
    });
  });
}
