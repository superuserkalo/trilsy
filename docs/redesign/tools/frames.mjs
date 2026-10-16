// Key-moment screenshots and a slow-scroll video.
// node frames.mjs <name> <url> <width> shots <label> <y1,y2,...> [waitMs]     -> out/<name>-<width>/<label>-<y>.jpeg + sheet
// node frames.mjs <name> <url> <width> timed <label> <y> <t1,t2,...ms>       -> scroll to y, shots at times after arrival
// node frames.mjs <name> <url> <width> video <label> <y0> <y1> [pxPerTick]   -> wheel-scrolled video + time/scrollY log
import { chromium } from 'playwright';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const [name, url, w, mode, label, a1, a2, a3] = process.argv.slice(2);
const width = +w, height = width > 600 ? 900 : 844;
const out = `out/${name}-${width}`;
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({
  viewport: { width, height }, deviceScaleFactor: 1, isMobile: width < 600, hasTouch: width < 600,
  userAgent: width < 600 ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' : undefined,
  ...(mode === 'video' ? { recordVideo: { dir: `${out}/video-${label}`, size: { width, height } } } : {}),
});
const page = await ctx.newPage();
const t0 = Date.now();
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);
await page.addStyleTag({ content: 'html{scroll-behavior:auto!important} #usercentrics-cmp-ui,[class*=iubenda],[id*=iubenda],[id*=usercentrics]{display:none!important}' });
await page.evaluate(() => { const kill = () => document.querySelectorAll('#iubenda-cs-banner,#usercentrics-cmp-ui').forEach(e => e.remove()); kill(); new MutationObserver(kill).observe(document.body, { childList: true }); });
const scrollTo = y => page.evaluate(v => window.scrollTo(0, v), y);
const H = await page.evaluate(() => document.documentElement.scrollHeight);
if (mode !== 'video' && !process.env.FRESH) { for (let y = 0; y < H; y += 600) { await scrollTo(y); await page.waitForTimeout(120); } await scrollTo(0); await page.waitForTimeout(1200); }
const sheet = (files, tile) => execFileSync('montage', ['-label', '%t', ...files, '-resize', `${width > 600 ? 400 : 220}x`, '-tile', `${tile || Math.min(files.length, width > 600 ? 4 : 6)}x`, '-geometry', '+4+4', '-background', '#222', '-fill', 'white', '-pointsize', '13', `${out}/sheet-${label}.jpeg`]);

if (mode === 'shots') {
  const files = [];
  let last = 0;
  for (const y of a1.split(',').map(Number)) {
    // approach in small steps so triggers between key moments still fire in order
    for (let s = last; s < y; s += 150) { await scrollTo(s); await page.waitForTimeout(60); }
    await scrollTo(y); await page.waitForTimeout(a2 ? +a2 : 1100); last = y;
    const f = `${out}/${label}-${String(y).padStart(5, '0')}.jpeg`;
    await page.screenshot({ path: f, type: 'jpeg', quality: 70 }); files.push(f);
  }
  sheet(files);
} else if (mode === 'timed') {
  const y = +a1; const files = [];
  if (!process.env.FRESH) for (let s = Math.max(0, y - 1500); s < y; s += 150) { await scrollTo(s); await page.waitForTimeout(50); }
  await scrollTo(y); const start = Date.now();
  for (const t of a2.split(',').map(Number)) {
    const wait = t - (Date.now() - start); if (wait > 0) await page.waitForTimeout(wait);
    const f = `${out}/${label}-t${String(t).padStart(5, '0')}.jpeg`;
    await page.screenshot({ path: f, type: 'jpeg', quality: 70 }); files.push(f);
  }
  sheet(files);
} else if (mode === 'video') {
  const y0 = +a1, y1 = +a2, tick = a3 ? +a3 : 12;
  await scrollTo(y0); await page.waitForTimeout(1500);
  await page.mouse.move(width / 2, height / 2);
  const log = [];
  for (let sent = 0; y0 + sent < y1; sent += tick) {
    await page.mouse.wheel(0, tick);
    if ((sent / tick) % 5 === 0) log.push([Date.now() - t0, y0 + sent + tick, Math.round(await page.evaluate(() => scrollY))]);
    await page.waitForTimeout(16);
  }
  await page.waitForTimeout(1500);
  fs.writeFileSync(`${out}/video-${label}.json`, JSON.stringify(log));
  const maxLag = Math.max(...log.map(l => Math.abs(l[1] - l[2])));
  console.log('video', label, 'samples', log.length, 'max |wheel sum - scrollY|', maxLag);
}
await ctx.close(); await browser.close();
if (mode === 'video') { const d = `${out}/video-${label}`; const f = fs.readdirSync(d).find(x => x.endsWith('.webm')); fs.renameSync(`${d}/${f}`, `${out}/video-${label}.webm`); fs.rmdirSync(d); }
