// Summarize a scroll log. Usage: node analyze.mjs <dir> [yMin] [yMax] [selFilter]
import fs from 'node:fs';
const [dir, yMinA, yMaxA, filt] = process.argv.slice(2);
const L = JSON.parse(fs.readFileSync(`${dir}/log.json`));
const yMin = yMinA ? +yMinA : 0, yMax = yMaxA ? +yMaxA : 1e9;
const { rids, meta, steps, up, height: VH } = L;
const dec = t => {
  if (!t) return { tx: 0, ty: 0, s: 1, r: 0 };
  const n = t.match(/-?[\d.e-]+/g).map(Number);
  if (t.startsWith('matrix3d')) return { tx: n[12], ty: n[13], s: Math.hypot(n[0], n[1]), r: Math.atan2(n[1], n[0]) * 57.3 };
  return { tx: n[4], ty: n[5], s: Math.hypot(n[0], n[1]), r: Math.atan2(n[1], n[0]) * 57.3 };
};
const r1 = v => Math.round(v * 10) / 10, r2 = v => Math.round(v * 100) / 100;
// segments where a numeric series changes: returns [{y0,y1,v0,v1,mid}]
function segs(ys, vs, eps) {
  const out = []; let i = 0;
  while (i < vs.length - 1) {
    if (Math.abs(vs[i + 1] - vs[i]) <= eps) { i++; continue; }
    let j = i + 1;
    while (j < vs.length - 1 && Math.abs(vs[j + 1] - vs[j]) > eps) j++;
    const mid = vs[Math.round((i + j) / 2)];
    out.push({ y0: ys[i], y1: ys[j], v0: vs[i], v1: vs[j], mid, n: j - i });
    i = j;
  }
  return out;
}
const fmt = (name, ss, f = r2) => ss.length ? `${name}[` + ss.slice(0, 6).map(s => `${s.y0}-${s.y1}: ${f(s.v0)}>${f(s.mid)}>${f(s.v1)}`).join('; ') + (ss.length > 6 ? `; +${ss.length - 6}` : '') + ']' : '';
const upMap = new Map(up.map(u => [u.y, u.settled]));
const rows = [];
rids.forEach((rid, k) => {
  const m = meta[rid]; if (!m) return;
  if (filt && !new RegExp(filt).test(m.path)) return;
  const ys = [], top = [], left = [], w = [], h = [], op = [], tx = [], ty = [], sc = [], rot = [], clip = [], filtS = [];
  let lag = 0, hyst = 0, n = 0;
  for (const st of steps) {
    const s = st.settled[k]; if (!s) continue;
    const onScreen = s[0] < VH && s[0] + s[3] > 0 && s[8];
    if (!onScreen || st.y < yMin || st.y > yMax) continue;
    const d = dec(s[5]); n++;
    ys.push(st.y); top.push(s[0]); left.push(s[1]); w.push(s[2]); h.push(s[3]); op.push(s[4]); tx.push(d.tx); ty.push(d.ty); sc.push(d.s); rot.push(d.r); clip.push(s[7]); filtS.push(s[6]);
    const e = st.early[k];
    if (e && (Math.abs(e[4] - s[4]) > 0.03 || Math.abs(e[0] - s[0]) > 2 || Math.abs(e[1] - s[1]) > 2 || Math.abs(e[2] - s[2]) > 2)) lag++;
    const u = upMap.get(st.y)?.[k];
    if (u && (Math.abs(u[4] - s[4]) > 0.03 || Math.abs(u[0] - s[0]) > 2 || Math.abs(u[1] - s[1]) > 2)) hyst++;
  }
  if (n < 2) return;
  // pinned: top constant while y changes
  const pins = []; let i = 0;
  while (i < top.length - 1) { let j = i; while (j < top.length - 1 && Math.abs(top[j + 1] - top[i]) < 1.5 && ys[j + 1] - ys[j] < L.step * 2) j++; if (ys[j] - ys[i] >= 150) pins.push(`${ys[i]}-${ys[j]}@${Math.round(top[i])}`); i = j + 1; }
  const sOp = segs(ys, op, 0.02), sTx = segs(ys, tx, 0.8), sTy = segs(ys, ty, 0.8), sSc = segs(ys, sc, 0.004), sRot = segs(ys, rot, 0.2), sW = segs(ys, w, 1.5), sH = segs(ys, h, 1.5), sLeft = segs(ys, left, 1.5);
  const clips = [...new Set(clip)].length, filts = [...new Set(filtS)].length;
  const score = (pins.length ? 3 : 0) + sOp.length + sTx.length + sTy.length + sSc.length + sRot.length + sW.length + (clips > 1 ? 2 : 0) + (filts > 1 ? 2 : 0);
  if (!score) return;
  const line = [fmt('op', sOp), fmt('tx', sTx, r1), fmt('ty', sTy, r1), fmt('scale', sSc), fmt('rot', sRot, r1), fmt('w', sW, Math.round), fmt('h', sH, Math.round), fmt('left', sLeft, Math.round), pins.length ? `PIN[${pins.slice(0, 4).join(', ')}]` : '', clips > 1 ? `clip×${clips} (${clip[0].slice(0, 40)} … ${clip[clip.length - 1].slice(0, 60)})` : '', filts > 1 ? `filter×${filts} (${filtS.find(f => f)?.slice(0, 40)})` : '', lag ? `LAG×${lag}` : '', hyst ? `HYST×${hyst}` : '', m.transition ? `tr(${m.transition.slice(0, 70)})` : ''].filter(Boolean).join(' ');
  rows.push({ y: ys[0], yEnd: ys[ys.length - 1], sel: m.sel, path: m.path, text: m.text, pos: m.pos, line, sig: m.sel + '|' + line.replace(/\d+/g, '#').slice(0, 80) });
});
rows.sort((a, b) => a.y - b.y);
const seen = new Map();
for (const r of rows) { const c = seen.get(r.sig); if (c) { c.count++; continue; } r.count = 1; seen.set(r.sig, r); }
for (const r of seen.values()) console.log(`y${r.y}-${r.yEnd} ${r.count > 1 ? '(×' + r.count + ') ' : ''}${r.pos !== 'static' && r.pos !== 'relative' ? '{' + r.pos + '} ' : ''}${r.path.split(' > ').slice(-2).join(' > ')}${r.text ? ' "' + r.text.slice(0, 30) + '"' : ''}\n    ${r.line}`);
