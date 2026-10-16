// Renders the social preview images (Open Graph / Twitter) to public/og/{lang}.png.
// Run after changing the headline or the look: npm run og
import { mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';

const WIDTH = 1200;
const HEIGHT = 630;

const COPY = {
  es: {
    kicker: 'Ingeniería de Software · Portfolio',
    title: 'Construyo interfaces que se sienten',
    emphasis: 'bien.',
  },
  en: {
    kicker: 'Software Engineering · Portfolio',
    title: 'I build interfaces that feel',
    emphasis: 'right.',
  },
};

const page = ({ kicker, title, emphasis }) => `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,500;1,400&family=Geist+Mono:wght@400;500&family=Geist:wght@600&display=block">
<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: ${WIDTH}px; height: ${HEIGHT}px; background: #fff; color: #1c1a17; position: relative; overflow: hidden; }
  .frame { position: absolute; inset: 0 72px; border-left: 1px dashed #b4b1a9; border-right: 1px dashed #b4b1a9; }
  .rule { position: absolute; left: 0; right: 0; border-top: 1px dashed #8e8b83; }
  .content { position: absolute; inset: 64px 128px 60px; display: flex; flex-direction: column; }
  .top { display: flex; justify-content: space-between; align-items: center; }
  .kicker { font: 500 18px 'Geist Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: #5c5952; }
  .mark { width: 76px; height: 76px; border-radius: 50%; border: 1px solid rgba(28,26,23,.1); display: grid; place-items: center;
          font: italic 400 32px 'EB Garamond', serif; box-shadow: 0 8px 24px rgba(28,26,23,.08); }
  h1 { margin-top: auto; font: 500 104px/0.96 'EB Garamond', serif; letter-spacing: -0.025em; max-width: 900px; }
  em { font-weight: 400; }
  .bottom { margin-top: 44px; display: flex; justify-content: space-between; font: 400 18px 'Geist Mono', monospace; color: #5c5952; }
  .name { font: 600 22px 'Geist', sans-serif; color: #1c1a17; letter-spacing: -0.01em; }
  .corner { position: absolute; width: 12px; height: 12px; }
</style></head>
<body>
  <div class="frame"></div>
  <div class="rule" style="top: 32px"></div>
  <div class="rule" style="bottom: 32px"></div>
  <div class="corner" style="left: 71px; top: 31px; border-left: 2px solid #1c1a17; border-top: 2px solid #1c1a17"></div>
  <div class="corner" style="right: 71px; bottom: 31px; border-right: 2px solid #1c1a17; border-bottom: 2px solid #1c1a17"></div>
  <div class="content">
    <div class="top"><span class="kicker">${kicker}</span><span class="mark">SG</span></div>
    <h1>${title} <em>${emphasis}</em></h1>
    <div class="bottom"><span class="name">Sebastián González</span><span>TypeScript · React · Next.js</span></div>
  </div>
</body></html>`;

mkdirSync('public/og', { recursive: true });
const browser = await chromium.launch();
const tab = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
for (const [lang, copy] of Object.entries(COPY)) {
  await tab.setContent(page(copy), { waitUntil: 'networkidle' });
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: `public/og/${lang}.png` });
  console.log(`public/og/${lang}.png`);
}
await browser.close();
