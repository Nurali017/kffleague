/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const TOURNAMENTS = ['pl', '1l', 'cup', '2l', 'el'];
const PAGES = [
  { key: 'teams', path: '/stats/teams' },
  { key: 'players', path: '/stats/players' },
];
const LANGS = ['ru', 'kz'];
const THEMES = ['light', 'dark'];

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const OUT_DIR =
  process.env.OUT_DIR || path.join(process.cwd(), 'ux-screenshots', 'stats');

const VIEWPORT_WIDTH = Number(process.env.VIEWPORT_WIDTH) || 1440;
const VIEWPORT_HEIGHT = Number(process.env.VIEWPORT_HEIGHT) || 900;

function safeMkdir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function waitForStatsReady(page) {
  // Most loading states use `animate-pulse` skeletons. Wait for them to disappear.
  // If something keeps pulsing (unexpected), proceed anyway after timeout.
  try {
    await page.waitForFunction(
      () => document.querySelectorAll('.animate-pulse').length === 0,
      null,
      { timeout: 15000 }
    );
  } catch {
    // ignore
  }

  // Wait for fonts to be ready (prevents layout shifts in hero/charts).
  try {
    await page.evaluate(async () => {
      if (document.fonts && 'ready' in document.fonts) {
        // @ts-ignore - some browsers may not type this well
        await document.fonts.ready;
      }
    });
  } catch {
    // ignore
  }

  // Give layout a moment to settle (charts, fonts, sticky headers).
  await page.waitForTimeout(750);
}

function getCookieDomain() {
  try {
    const u = new URL(BASE_URL);
    return u.hostname;
  } catch {
    return 'localhost';
  }
}

async function main() {
  safeMkdir(OUT_DIR);

  const cookieDomain = getCookieDomain();
  const startedAt = new Date().toISOString();
  const manifest = {
    startedAt,
    baseUrl: BASE_URL,
    viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
    files: [],
  };

  const browser = await chromium.launch({ headless: true });
  try {
    for (const lang of LANGS) {
      for (const theme of THEMES) {
        const context = await browser.newContext({
          viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
          deviceScaleFactor: 1,
          reducedMotion: 'reduce',
        });

        await context.addCookies([
          {
            name: 'NEXT_LOCALE',
            value: lang,
            domain: cookieDomain,
            path: '/',
          },
        ]);

        await context.addInitScript(
          ({ initLang, initTheme }) => {
            try {
              localStorage.setItem('i18nextLng', initLang);
              localStorage.setItem('theme', initTheme);
            } catch {
              // ignore
            }
          },
          { initLang: lang, initTheme: theme }
        );

        for (const tournament of TOURNAMENTS) {
          for (const pageDef of PAGES) {
            const url = `${BASE_URL}${pageDef.path}?tournament=${encodeURIComponent(
              tournament
            )}`;
            const fileName = `${lang}_${theme}_${tournament}_${pageDef.key}.png`;
            const outPath = path.join(OUT_DIR, fileName);

            const page = await context.newPage();
            try {
              console.log(`→ ${fileName}  (${url})`);
              await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
              await waitForStatsReady(page);
              await page.screenshot({ path: outPath, fullPage: false });

              manifest.files.push({
                fileName,
                outPath,
                url,
                lang,
                theme,
                tournament,
                page: pageDef.key,
              });
            } catch (err) {
              console.error(`✗ Failed: ${fileName}`);
              console.error(err);
              manifest.files.push({
                fileName,
                outPath,
                url,
                lang,
                theme,
                tournament,
                page: pageDef.key,
                error: String(err),
              });
            } finally {
              await page.close().catch(() => {});
            }
          }
        }

        await context.close();
      }
    }
  } finally {
    await browser.close();
  }

  const manifestPath = path.join(OUT_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`\nDone. Saved ${manifest.files.length} entries.`);
  console.log(`Screenshots: ${OUT_DIR}`);
  console.log(`Manifest: ${manifestPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
