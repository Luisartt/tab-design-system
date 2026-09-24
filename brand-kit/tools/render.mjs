#!/usr/bin/env node
/* ==========================================================================
   TAB batch renderer: HTML templates -> PNG at native size

   Usage (from anywhere):
     NODE_PATH=$(npm root -g) node brand-kit/tools/render.mjs [jobs.json] [options]

   Options:
     --scale 2         deviceScaleFactor (default 1 = native pixel size)
     --only id[,id]    render only jobs whose template id matches
     --out dir         output folder (default brand-kit/exports)
     --list            print the jobs and exit
     --allow-missing-fonts  still write PNGs when Google Fonts fail (default: fail loudly)

   Job file (default brand-kit/templates/examples.json): an array of
     { "template": "social-quote", "variant": "navy", "photo": "../photos/03-owner.jpg",
       "focus": [60, 40], "fields": { "quote": "..." }, "out": "social-quote.png" }
   or asset jobs that rasterize a logo:
     { "asset": "../logos/tab-logo-color.svg", "width": 600, "background": "#FFFFFF", "out": "tab-logo-color-600.png" }
   Photo paths are relative to brand-kit/templates/ (same as in the editor and URL hash).

   A tiny node:http static server is rooted at the REPO root so the templates'
   ../../styles.css (tokens + Google Fonts) resolves exactly as in the editor.
   ========================================================================== */
import http from 'node:http';
import fs from 'node:fs/promises';
import { createReadStream, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BRAND_KIT = path.resolve(HERE, '..');
const REPO_ROOT = path.resolve(BRAND_KIT, '..');

/* ---------- args ---------- */
const argv = process.argv.slice(2);
const opt = { allowMissingFonts: false, scale: 1, only: null, out: path.join(BRAND_KIT, 'exports'), list: false, jobs: path.join(BRAND_KIT, 'templates', 'examples.json') };
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--scale') opt.scale = parseFloat(argv[++i]) || 1;
  else if (a === '--only') opt.only = argv[++i].split(',').map(s => s.replace(/\.html$/, ''));
  else if (a === '--out') opt.out = path.resolve(argv[++i]);
  else if (a === '--list') opt.list = true;
  else if (a === '--allow-missing-fonts') opt.allowMissingFonts = true;
  else if (a === '-h' || a === '--help') { console.log((await fs.readFile(fileURLToPath(import.meta.url), 'utf8')).split('\n').slice(2, 20).join('\n')); process.exit(0); }
  else opt.jobs = path.resolve(a);
}

/* ---------- playwright (globally installed; ESM ignores NODE_PATH, so use require) ---------- */
function loadPlaywright() {
  const require = createRequire(import.meta.url);
  try { return require('playwright'); } catch { /* try the global root */ }
  try {
    const root = execSync('npm root -g', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    return require(path.join(root, 'playwright'));
  } catch {
    console.error('Playwright not found. Run with: NODE_PATH=$(npm root -g) node brand-kit/tools/render.mjs');
    process.exit(1);
  }
}

/* ---------- static server rooted at the repo ---------- */
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8', '.md': 'text/markdown; charset=utf-8'
};
function startServer(root) {
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://x');
      let p = path.normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, '');
      const file = path.join(root, p);
      if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
      const st = await fs.stat(file).catch(() => null);
      if (!st || !st.isFile()) { res.writeHead(404, { 'content-type': 'text/plain' }).end('not found'); return; }
      res.writeHead(200, { 'content-type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-cache' });
      createReadStream(file).pipe(res);
    } catch (e) { res.writeHead(500).end(String(e)); }
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server)));
}

/* ---------- main ---------- */
const jobs = JSON.parse(await fs.readFile(opt.jobs, 'utf8'));
const jobKey = j => j.asset ? path.basename(j.asset).replace(/\.\w+$/, '') : String(j.template).replace(/\.html$/, '');
const selected = jobs.filter(j => !opt.only || opt.only.includes(jobKey(j)));
if (opt.list) { selected.forEach(j => console.log(`${jobKey(j)}${j.variant ? ' [' + j.variant + ']' : ''} -> ${j.out || '(auto)'}`)); process.exit(0); }
if (!selected.length) { console.error('No jobs to render.'); process.exit(1); }

await fs.mkdir(opt.out, { recursive: true });
const server = await startServer(REPO_ROOT);
const port = server.address().port;
const { chromium } = loadPlaywright();
const browser = await chromium.launch();
const context = await browser.newContext({ deviceScaleFactor: opt.scale, viewport: { width: 2400, height: 1400 } });

let problems = 0;
const fontIssues = new Set();
console.log(`Rendering ${selected.length} job(s) at ${opt.scale}x -> ${path.relative(process.cwd(), opt.out) || '.'}`);

async function renderAsset(job) {
  // { "asset": "../logos/tab-logo-color.svg", "width": 600, "background": "#FFFFFF", "out": "tab-logo-color-600.png" }
  const url = new URL(job.asset, `http://127.0.0.1:${port}/brand-kit/templates/`).href;
  const out = path.resolve(opt.out, job.out || path.basename(job.asset).replace(/\.\w+$/, `-${job.width || 'native'}.png`));
  const page = await context.newPage();
  try {
    await page.setViewportSize({ width: Math.max(320, (job.width || 1000) + 40), height: 1200 });
    await page.setContent(`<body style="margin:0;background:${job.background || 'transparent'}"><img id="a" src="${url}" style="display:block;${job.width ? 'width:' + job.width + 'px;height:auto' : ''}"></body>`);
    await page.waitForFunction(() => { const i = document.getElementById('a'); return i.complete; });
    const w = await page.evaluate(() => document.getElementById('a').naturalWidth);
    if (!w) throw new Error('asset failed to load: ' + job.asset);
    await page.locator('#a').screenshot({ path: out, omitBackground: !job.background });
    const box = await page.locator('#a').boundingBox();
    console.log(`  ok ${path.relative(process.cwd(), out)} (${Math.round(box.width * opt.scale)}x${Math.round(box.height * opt.scale)}, asset)`);
  } finally { await page.close(); }
}

for (const job of selected) {
  if (job.asset) {
    try { await renderAsset(job); } catch (e) { problems++; console.error(`  x ${job.asset}: ${e.message.split('\n')[0]}`); }
    continue;
  }
  const id = String(job.template).replace(/\.html$/, '');
  const file = path.join(BRAND_KIT, 'templates', id + '.html');
  if (!existsSync(file)) { console.error(`  x ${id}: template not found`); problems++; continue; }
  const suffix = opt.scale !== 1 ? '@' + opt.scale + 'x' : '';
  const out = path.resolve(opt.out, job.out ? job.out.replace(/\.png$/i, suffix + '.png') : `${id}${job.variant ? '-' + job.variant : ''}${suffix}.png`);
  const page = await context.newPage();
  const logs = [];
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') logs.push(m.text()); });
  page.on('pageerror', e => logs.push('pageerror: ' + e.message));
  try {
    await page.goto(`http://127.0.0.1:${port}/brand-kit/templates/${id}.html`, { waitUntil: 'load' });
    await page.waitForFunction(() => window.TAB && window.TAB.ready, null, { timeout: 15000 });
    const size = await page.evaluate(() => window.TAB.size());
    await page.setViewportSize({ width: Math.max(320, size.width), height: Math.max(200, size.height) });
    await page.evaluate(j => window.TAB.apply(j), job);
    const report = await page.evaluate(() => window.TAB.ready());
    // Every brand family must report a FontFace with status "loaded" before we screenshot.
    const missingFonts = Object.entries(report.fonts).filter(([, ok]) => !ok).map(([f]) => f);
    missingFonts.forEach(f => fontIssues.add(f));
    if (missingFonts.length && !opt.allowMissingFonts) {
      problems++;
      console.error(`  x ${id}: NOT RENDERED, fonts not loaded: ${missingFonts.join(', ')} (use --allow-missing-fonts to force)`);
      continue;
    }
    await page.waitForTimeout(60);
    await page.locator('.artboard').screenshot({ path: out, animations: 'disabled' });

    const notes = [];
    if (missingFonts.length) notes.push('fonts not loaded: ' + missingFonts.join(', '));
    if (report.failedImages.length) notes.push('images failed: ' + report.failedImages.join(', '));
    if (report.overflow.length) notes.push('text overflows: ' + report.overflow.join(', '));
    const fallbacks = logs.filter(l => /fallback/i.test(l));
    if (fallbacks.length) notes.push(fallbacks.length + ' asset fallback(s) used');
    const errors = logs.filter(l => !/fallback|Failed to load resource/i.test(l));
    if (errors.length) notes.push('console: ' + errors.slice(0, 3).join(' | '));
    if (missingFonts.length || report.failedImages.length || report.overflow.length) problems++;
    console.log(`  ${notes.length ? '!' : 'ok'} ${path.relative(process.cwd(), out)} (${size.width * opt.scale}x${size.height * opt.scale})${notes.length ? '\n      ' + notes.join('\n      ') : ''}`);
  } catch (e) {
    problems++;
    console.error(`  x ${id}: ${e.message.split('\n')[0]}`);
  } finally {
    await page.close();
  }
}

await browser.close();
server.close();
if (fontIssues.size) console.error(`\nERROR: Google Fonts did not load (${[...fontIssues].join(', ')}). Affected jobs were NOT rendered; check network/proxy access to fonts.googleapis.com and fonts.gstatic.com.`);
console.log(problems ? `\nDone with ${problems} job(s) needing attention.` : '\nDone. All jobs rendered cleanly.');
process.exit(problems ? 2 : 0);
