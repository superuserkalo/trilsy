// Numeric scroll log. Usage: node scrolllog.mjs <name> <url> <width> [stepPx]
// Phase 1 finds elements whose own style or position relative to their parent changes with scroll.
// Phase 2 logs those elements at every step (early sample and settled sample), then an upward pass.
// Also dumps GSAP ScrollTrigger instances and CSS scroll-driven animations when present.
import { chromium } from 'playwright';
import fs from 'node:fs';

const [name, url, w = '1440', stepArg] = process.argv.slice(2);
const width = +w, height = width > 600 ? 900 : 844;
const out = `out/${name}-${width}`;
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({
  viewport: { width, height }, deviceScaleFactor: 1,
  isMobile: width < 600, hasTouch: width < 600,
  userAgent: width < 600 ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' : undefined,
});
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(6000);
await page.addStyleTag({ content: 'html{scroll-behavior:auto!important} #usercentrics-cmp-ui,[class*=iubenda],[id*=iubenda],[id*=usercentrics],[class*=cookie i][class*=banner i]{display:none!important}' });
await page.evaluate(() => { const kill = () => document.querySelectorAll('#iubenda-cs-banner,#usercentrics-cmp-ui').forEach(e => e.remove()); kill(); new MutationObserver(kill).observe(document.body, { childList: true }); });

const scrollTo = async y => { await page.evaluate(v => window.scrollTo(0, v), y); };
const H0 = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H0; y += 500) { await scrollTo(y); await page.waitForTimeout(200); }
await scrollTo(0); await page.waitForTimeout(1500);

await page.evaluate(() => {
  window.__sel = el => { let s = el.tagName.toLowerCase(); if (el.id) s += '#' + el.id; const c = (el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 3).join('.'); if (c) s += '.' + c; return s.slice(0, 100); };
  window.__path = el => { const p = []; let e = el; while (e && e !== document.body && p.length < 4) { p.unshift(window.__sel(e)); e = e.parentElement; } return p.join(' > '); };
  window.__tag = () => { let i = window.__n || 0; for (const el of document.body.querySelectorAll('*')) if (!el.dataset.rid) el.dataset.rid = String(i++); window.__n = i; };
  window.__hashAll = () => {
    window.__tag(); const o = {};
    for (const el of document.body.querySelectorAll('*')) {
      if (/^(SCRIPT|STYLE|NOSCRIPT|BR|PATH|G|DEFS|LINEARGRADIENT|STOP|CIRCLE|RECT|LINE|POLYGON|ELLIPSE|CLIPPATH|MASK|USE|TITLE)$/i.test(el.tagName)) continue;
      const r = el.getBoundingClientRect(); if (r.width * r.height < 300) continue;
      const pr = el.parentElement.getBoundingClientRect(); const cs = getComputedStyle(el);
      o[el.dataset.rid] = [Math.round(r.top - pr.top), Math.round(r.left - pr.left), Math.round(r.width), Math.round(r.height), cs.opacity, cs.transform, cs.filter, cs.clipPath, cs.position === 'fixed' ? 'F' + Math.round(r.top) : ''].join('|');
    }
    return o;
  };
  window.__sample = rids => rids.map(rid => {
    const el = document.querySelector(`[data-rid="${rid}"]`); if (!el) return null;
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    return [Math.round(r.top * 10) / 10, Math.round(r.left * 10) / 10, Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10, +(+cs.opacity).toFixed(3), cs.transform === 'none' ? '' : cs.transform, cs.filter === 'none' ? '' : cs.filter, cs.clipPath === 'none' ? '' : cs.clipPath, cs.visibility === 'hidden' || cs.display === 'none' ? 0 : 1];
  });
});

const H = await page.evaluate(() => document.documentElement.scrollHeight);
const max = H - height;
const step = stepArg ? +stepArg : Math.max(40, Math.round(H / 200 / 10) * 10);

// Phase 1: discovery at 3x the step
const interesting = new Set(); let prev = null;
for (let y = 0; y <= max; y += step * 3) {
  await scrollTo(y); await page.waitForTimeout(260);
  const h = await page.evaluate(() => window.__hashAll());
  if (prev) for (const k in h) if (k in prev && prev[k] !== h[k]) interesting.add(k);
  prev = h;
}
await scrollTo(0); await page.waitForTimeout(1200);
const rids = [...interesting];
const meta = await page.evaluate(rids => Object.fromEntries(rids.map(rid => { const el = document.querySelector(`[data-rid="${rid}"]`); if (!el) return [rid, null]; const cs = getComputedStyle(el); return [rid, { sel: window.__sel(el), path: window.__path(el), parent: el.parentElement?.dataset.rid, tag: el.tagName, pos: cs.position, text: (el.children.length === 0 ? el.textContent : '').trim().slice(0, 60), transition: cs.transitionDuration !== '0s' ? `${cs.transitionProperty} ${cs.transitionDuration} ${cs.transitionTimingFunction}` : '', willChange: cs.willChange }]; })), rids);

// Phase 2: fine log, early + settled samples
const steps = [];
for (let y = 0; y <= max; y += step) {
  await scrollTo(y);
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  const early = await page.evaluate(r => window.__sample(r), rids);
  await page.waitForTimeout(850);
  const settled = await page.evaluate(r => window.__sample(r), rids);
  steps.push({ y, early, settled });
}
// Upward pass, coarser, settled only
const up = [];
for (let y = Math.floor(max / (step * 4)) * step * 4; y >= 0; y -= step * 4) {
  await scrollTo(y); await page.waitForTimeout(900);
  up.push({ y, settled: await page.evaluate(r => window.__sample(r), rids) });
}

// Tooling dumps
const tooling = await page.evaluate(() => {
  const safe = v => { try { return JSON.parse(JSON.stringify(v, (k, x) => (typeof x === 'function' ? 'fn' : x instanceof Element ? window.__sel(x) : x))); } catch { return String(v); } };
  const res = { scrollTriggers: null, scrollAnims: [], lenis: !!document.querySelector('.lenis, [data-lenis-prevent]') || /lenis/.test(document.documentElement.className) };
  if (window.ScrollTrigger) {
    res.gsap = window.gsap?.version;
    res.scrollTriggers = window.ScrollTrigger.getAll().map(st => {
      const a = st.animation; let kids = null;
      if (a) { const list = a.getChildren ? a.getChildren(true, true, false) : [a]; kids = list.slice(0, 40).map(c => ({ targets: (c.targets?.() || []).slice(0, 4).map(t => (t instanceof Element ? window.__path(t) : typeof t)), nTargets: (c.targets?.() || []).length, start: +c.startTime().toFixed(3), dur: +c.duration().toFixed(3), vars: safe(c.vars) })); }
      return { trigger: st.trigger ? window.__path(st.trigger) : null, start: Math.round(st.start), end: Math.round(st.end), pin: st.pin ? window.__path(st.pin) : null, scrub: st.vars.scrub ?? null, toggleActions: st.vars.toggleActions ?? null, once: st.vars.once ?? null, startVar: safe(st.vars.start), endVar: safe(st.vars.end), snap: safe(st.vars.snap), animDur: a ? +a.duration().toFixed(3) : null, nKids: kids?.length, kids };
    });
  }
  for (const a of document.getAnimations()) {
    const tl = a.timeline; if (!tl || tl.constructor.name === 'DocumentTimeline') continue;
    res.scrollAnims.push({ timeline: tl.constructor.name, axis: tl.axis, source: tl.source ? window.__sel(tl.source) : null, subject: tl.subject ? window.__path(tl.subject) : null, name: a.animationName, target: a.effect?.target ? window.__path(a.effect.target) : null, rangeStart: safe(a.rangeStart), rangeEnd: safe(a.rangeEnd), timing: safe(a.effect?.getTiming?.()), keyframes: safe(a.effect?.getKeyframes?.()) });
  }
  return res;
});

fs.writeFileSync(`${out}/log.json`, JSON.stringify({ url, width, height, H, step, rids, meta, steps, up }));
fs.writeFileSync(`${out}/tooling.json`, JSON.stringify(tooling, null, 1));
console.log(name, width, 'H', H, 'step', step, 'interesting', rids.length, 'steps', steps.length, 'ST', tooling.scrollTriggers?.length ?? '-', 'scrollAnims', tooling.scrollAnims.length);
await browser.close();
