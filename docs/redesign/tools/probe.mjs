// Same capture for an original and its prototype: sample named probes at fixed offsets from a start scrollY.
// node probe.mjs <out.json> <url> <width> <startY|sel:CSS> <lengthPx> <stepPx> name=selector@prop ...
// props: top left w h op scale tx ty clip (first inset length, px) cls:<class> shown (index of first match with opacity>0.5)
import { chromium } from 'playwright';
import fs from 'node:fs';
const [outFile, url, w, startArg, len, step, ...specs] = process.argv.slice(2);
const width = +w, height = width > 600 ? 900 : 844;
const browser = await chromium.launch({ channel: 'chrome', args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 })).newPage();
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(url.includes('localhost') ? 800 : 5000);
await page.addStyleTag({ content: 'html{scroll-behavior:auto!important} #usercentrics-cmp-ui,[class*=iubenda],[id*=iubenda],[id*=usercentrics]{display:none!important}' });
await page.evaluate(() => { const kill = () => document.querySelectorAll('#iubenda-cs-banner,#usercentrics-cmp-ui').forEach(e => e.remove()); kill(); new MutationObserver(kill).observe(document.body, { childList: true }); });
const scrollTo = y => page.evaluate(v => window.scrollTo(0, v), y);
if (!url.includes('localhost')) { const H = await page.evaluate(() => document.documentElement.scrollHeight); for (let y = 0; y < H; y += 600) { await scrollTo(y); await page.waitForTimeout(120); } await scrollTo(0); await page.waitForTimeout(1200); }
const start = startArg.startsWith('sel:') ? await page.evaluate(s => Math.round(document.querySelector(s).getBoundingClientRect().top + scrollY), startArg.slice(4)) : +startArg;
const probes = specs.map(s => { const eq = s.indexOf('='); const name = s.slice(0, eq), rest = s.slice(eq + 1); const i = rest.lastIndexOf('@'); return { name, sel: rest.slice(0, i), prop: rest.slice(i + 1) }; });
const rows = [];
for (let off = -Math.round(+step * 4); off <= +len + +step * 2; off += +step) {
  await scrollTo(start + off); await page.waitForTimeout(950);
  const vals = await page.evaluate(([probes, start]) => probes.map(p => {
    if (p.prop === 'scroll') return Math.round(scrollY - start);
    const els = [...document.querySelectorAll(p.sel)]; const el = els[0]; if (!el) return null;
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    const m = cs.transform === 'none' ? null : cs.transform.match(/-?[\d.e-]+/g).map(Number);
    const is3d = cs.transform.startsWith('matrix3d');
    switch (p.prop.split(':')[0]) {
      case 'top': return Math.round(r.top); case 'left': return Math.round(r.left); case 'w': return Math.round(r.width); case 'h': return Math.round(r.height);
      case 'op': return +(+cs.opacity).toFixed(2);
      case 'scale': return m ? +Math.hypot(m[0], m[1]).toFixed(3) : 1;
      case 'tx': return m ? Math.round(m[is3d ? 12 : 4]) : 0; case 'ty': return m ? Math.round(m[is3d ? 13 : 5]) : 0;
      case 'clip': { const c = cs.clipPath.match(/inset\((calc\(([\d.]+)% - ([\d.]+)px\)|([\d.]+)px|([\d.]+)%)/); if (!c) return 0; return Math.round(c[2] != null ? (c[2] / 100) * r.height - c[3] : c[4] != null ? +c[4] : (c[5] / 100) * r.height); }
      case 'cls': return el.classList.contains(p.prop.split(':')[1]) ? 1 : 0;
      case 'shown': return els.findIndex(e => +getComputedStyle(e).opacity > 0.5);
    }
  }), [probes, start]);
  rows.push([off, ...vals]);
}
fs.writeFileSync(outFile, JSON.stringify({ url, start, names: probes.map(p => p.name), rows }));
console.log(outFile, 'start', start, 'rows', rows.length);
await browser.close();
