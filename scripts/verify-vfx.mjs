// Browser smoke for elective pages. Run against a dev server, for example:
// node scripts/verify-vfx.mjs http://localhost:5182
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = 'electives/vfx';
const base = process.argv[2] ?? 'http://localhost:5182';
const folders = [];
async function collect(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const item = path.join(dir, entry.name);
    if (entry.isDirectory()) await collect(item);
    else if (entry.name === 'README.md') folders.push(dir.replaceAll('\\', '/'));
  }
}
await collect(root);
folders.sort();

const browser = await chromium.launch({ headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader'] });
const failures = [];
try {
  for (const folder of folders) {
    const page = await browser.newPage({ viewport: { width: 1180, height: 820 } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    try {
      const source = await readFile(path.join(folder, 'README.md'), 'utf8');
      const expected = (source.match(/data-scene=/g) ?? []).length + (source.includes('data-exercise') ? 1 : 0) + (source.includes('data-effect') ? 1 : 0);
      await page.goto(`${base}/harness/?drill=${folder}&backend=webgl`, { waitUntil: 'domcontentloaded' });
      await page.locator('h1').first().waitFor({ timeout: 30000 });
      await page.waitForFunction((minimum) => document.querySelectorAll('canvas').length >= minimum, expected, { timeout: 30000 });
      await page.waitForTimeout(500);
      const body = await page.locator('body').innerText();
      const canvasCount = await page.locator('canvas').count();
      if (!canvasCount || /No scene named|couldn't be drawn|failed to load|didn't load|Reference error:/i.test(body)) {
        errors.push(`canvas=${canvasCount}; page reports a load or draw failure`);
      }
      if (canvasCount < expected) errors.push(`canvas=${canvasCount}; expected at least ${expected}`);
      if (source.includes('data-exercise')) {
        await page.goto(`${base}/harness/?drill=${folder}&backend=webgl&vfx-check=1`, { waitUntil: 'domcontentloaded' });
        try {
          await page.locator('.exercise .result').filter({ hasText: 'Reference self-check; progress not logged.' }).waitFor({ timeout: 30000 });
          const result = await page.locator('.exercise .result').innerText();
          if (!result.includes('Match: 100%')) errors.push(`reference mask did not score 100%: ${result}`);
        } catch {
          errors.push(`reference mask self-check failed: ${await page.locator('.exercise .result').innerText().catch(() => 'no result')}`);
        }
      }
      if (errors.length) failures.push(`${folder}: ${errors.join(' | ')}`);
      else process.stdout.write(`OK ${folder} (${canvasCount} canvas)\n`);
    } catch (error) {
      failures.push(`${folder}: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`VFX browser smoke: ${folders.length}/${folders.length} pages`);
}
