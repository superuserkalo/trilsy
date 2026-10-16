// Print the settled rect/opacity series of elements matching a path regex. node series.mjs <dir> <regex> [yMin] [yMax] [every]
import fs from 'node:fs';
const [dir, re, y0 = 0, y1 = 1e9, every = 1] = process.argv.slice(2);
const L = JSON.parse(fs.readFileSync(`${dir}/log.json`));
const ks = L.rids.map((r, k) => [r, k]).filter(([r]) => L.meta[r] && new RegExp(re).test(L.meta[r].path));
console.log('cols:', ks.map(([r]) => L.meta[r].sel).join(' | '), ' -> y: top,left,w,h,op');
L.steps.filter(s => s.y >= +y0 && s.y <= +y1).forEach((s, i) => { if (i % +every) return; console.log(s.y + ': ' + ks.map(([, k]) => { const v = s.settled[k]; return v ? `${Math.round(v[0])},${Math.round(v[1])},${Math.round(v[2])},${Math.round(v[3])},${v[4]}` : '-'; }).join(' | ')); });
