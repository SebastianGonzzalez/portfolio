import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  // Screenshots depend on the OS font rasteriser: baselines are taken on the dev machine, CI skips them.
  ignoreSnapshots: !!process.env.CI,
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.001, animations: 'disabled' } },
  use: {
    baseURL: `http://localhost:${PORT}/portfolio/`,
    locale: 'es-CO',
    timezoneId: 'America/Bogota',
    reducedMotion: 'reduce',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], deviceScaleFactor: 1 } },
    // Other engines run the functional and accessibility suites; the pixel baselines are Chromium's.
    ...[
      { name: 'firefox', use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } } },
      { name: 'webkit', use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } } },
      { name: 'iphone', use: { ...devices['iPhone 15'] } },
    ].map((project) => ({ ...project, testIgnore: /visual\.spec\.ts/ })),
  ],
  webServer: {
    command: `node scripts/serve-export.mjs ${PORT}`,
    url: `http://localhost:${PORT}/portfolio/`,
    reuseExistingServer: !process.env.CI,
  },
});
