import { expect, test } from './fixtures';

test.describe('languages', () => {
  test('Spanish is the default page and links to English', async ({ open }) => {
    const page = await open('es');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Construyo interfaces');
    await page.getByRole('link', { name: /Cambiar idioma/ }).click();
    await expect(page).toHaveURL(/\/portfolio\/en\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('I build interfaces');
  });

  test('English links back to Spanish', async ({ open }) => {
    const page = await open('en');
    await page.getByRole('link', { name: /Switch language/ }).click();
    await expect(page).toHaveURL(/\/portfolio\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });

  test('each language declares its canonical URL and alternates', async ({ open }) => {
    const page = await open('en');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://sebastiangonzzalez.github.io/portfolio/en/',
    );
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute(
      'href',
      'https://sebastiangonzzalez.github.io/portfolio/',
    );
    await expect(page).toHaveTitle('Sebastián González · Portfolio');
  });
});

test.describe('page', () => {
  test('in-page navigation brings the section into view', async ({ open }) => {
    const page = await open('es');
    // "Hablemos" is in the header on every screen size (the section nav is hidden on phones).
    await page.getByRole('link', { name: 'Hablemos' }).click();
    await expect(page.locator('#contacto')).toBeInViewport();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);
  });

  test('works offline with the bundled GitHub snapshot', async ({ open }) => {
    const page = await open('es');
    await expect(page.getByText(/última lectura/)).toBeVisible();
    await expect(page.getByText('Remove duplicate features from README')).toBeAttached();
  });

  test('the contribution calendar can be reached from the keyboard', async ({ open }) => {
    const page = await open('es');
    const calendar = page.getByRole('region', { name: 'Actividad en GitHub' });
    await calendar.focus();
    await expect(calendar).toBeFocused();
  });

  test('unknown URLs get the 404 page', async ({ page }) => {
    const response = await page.goto('./does-not-exist/');
    expect(response?.status()).toBe(404);
  });
});

test.describe('motion', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('the preloader plays once, then gets out of the way', async ({ open }) => {
    const page = await open('es');
    const preloader = page.getByText('Portfolio · cargando').locator('xpath=../../..');
    await expect(preloader).toBeHidden({ timeout: 5000 });
    await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('opacity', '1');
    await page.reload();
    await expect(preloader).toBeHidden();
  });
});

test.describe('shareable state', () => {
  test('a shared case link opens on that case, in view', async ({ open }) => {
    const page = await open('es', { query: '?caso=doose' });
    await expect(page.locator('#trabajo h3').first()).toHaveText('Doose');
    await expect(page.locator('#trabajo')).toBeInViewport();
  });

  test('featuring a case updates the URL', async ({ open }) => {
    const page = await open('es');
    // Keyboard activation: Playwright's scroll-into-view would park the button under the next stacked section.
    await page.getByRole('button', { name: 'Ver caso: Galería visual' }).focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\?caso=galeria-visual$/);
  });
});

test.describe('keyboard', () => {
  test('lab pieces move with the arrow keys', async ({ open }) => {
    const page = await open('es');
    const piece = page.getByRole('button', { name: /HEAD/ });
    await piece.focus();
    const before = await piece.boundingBox();
    await page.keyboard.press('Shift+ArrowRight');
    await page.keyboard.press('ArrowDown');
    await expect(page.getByText('Flechas para mover', { exact: false })).toBeVisible();
    await expect.poll(async () => (await piece.boundingBox())!.x - before!.x).toBeCloseTo(40, 0);
  });
});

test.describe('language suggestion', () => {
  test('offers English to an English-speaking visitor and remembers the choice', async ({ open }) => {
    const page = await open('es', { browserLanguages: ['en-US', 'en'] });
    const hint = page.getByRole('complementary', { name: 'This page is also available in English.' });
    await expect(hint).toBeVisible();
    await hint.getByRole('link', { name: 'Read in English →' }).click();
    await expect(page).toHaveURL(/\/portfolio\/en\/$/);
    await expect(page.getByRole('complementary')).toHaveCount(0);
  });

  test('can be dismissed for good', async ({ open }) => {
    const page = await open('es', { browserLanguages: ['en-US'] });
    await page.getByRole('button', { name: 'Dismiss' }).click();
    await expect(page.getByRole('complementary')).toHaveCount(0);
    await page.reload();
    await expect(page.getByRole('complementary')).toHaveCount(0);
  });
});

test.describe('sharing and indexing', () => {
  test('each language has its own preview image, and it is served', async ({ open, request }) => {
    for (const lang of ['es', 'en'] as const) {
      const page = await open(lang);
      const url = await page.locator('meta[property="og:image"]').getAttribute('content');
      expect(url).toBe(`https://sebastiangonzzalez.github.io/portfolio/og/${lang}.png`);
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        'content',
        'summary_large_image',
      );
      const image = await request.get(`./og/${lang}.png`);
      expect(image.headers()['content-type']).toBe('image/png');
    }
  });

  test('the sitemap lists both languages', async ({ request }) => {
    const sitemap = await (await request.get('./sitemap.xml')).text();
    expect(sitemap).toContain('<loc>https://sebastiangonzzalez.github.io/portfolio/</loc>');
    expect(sitemap).toContain('<loc>https://sebastiangonzzalez.github.io/portfolio/en/</loc>');
  });
});
