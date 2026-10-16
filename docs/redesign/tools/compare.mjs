// node compare.mjs <original.json> <prototype.json> [tolerance]  -> per-probe max deviation + side-by-side at a few offsets
import fs from 'node:fs';
const [a, b, tol = 12, skip = ''] = process.argv.slice(2);
// skip: 'probe:from-to,probe:from-to' leaves a clock-driven window out of one probe's comparison
const skips = skip.split(',').filter(Boolean).map(x => { const [n, r] = x.split(':'); const [f, t] = r.split('-').map(Number); return { n, f, t }; });
const A = JSON.parse(fs.readFileSync(a)), B = JSON.parse(fs.readFileSync(b));
const mb = new Map(B.rows.map(r => [r[0], r]));
console.log(`original start ${A.start}, prototype start ${B.start}, ${A.rows.length} offsets`);
A.names.forEach((n, i) => {
  let max = 0, at = 0, miss = 0, cnt = 0;
  for (const r of A.rows) { if (skips.some(k => k.n === n && r[0] >= k.f && r[0] <= k.t)) continue; const q = mb.get(r[0]); if (!q || r[i + 1] == null || q[i + 1] == null) continue; cnt++; const d = Math.abs(r[i + 1] - q[i + 1]); if (d > max) { max = d; at = r[0]; } if (d > +tol) miss++; }
  console.log(`${n.padEnd(10)} max |Δ| ${String(+max.toFixed(2)).padStart(7)} at offset ${String(at).padStart(5)}   offsets beyond tolerance ${miss}/${cnt}`);
});
const pick = A.rows.filter((_, i) => i % Math.ceil(A.rows.length / 14) === 0);
console.log('\noffset | ' + A.names.map(n => `${n} orig/proto`).join(' | '));
for (const r of pick) { const q = mb.get(r[0]) || []; console.log(String(r[0]).padStart(6) + ' | ' + A.names.map((n, i) => `${r[i + 1]}/${q[i + 1]}`).join(' | ')); }
