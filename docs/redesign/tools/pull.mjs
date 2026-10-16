// Overscroll pull at the page bottom: node pull.mjs <url> <width> <wrapSel> <panelSel> [shotsPrefix]
import { chromium } from 'playwright';
const [url, w='1440', wrapSel, panelSel, shots] = process.argv.slice(2);
const width=+w, height=width>600?900:844;
const b = await chromium.launch({ channel:'chrome' }); const p = await (await b.newContext({viewport:{width,height}})).newPage();
await p.goto(url,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(url.includes('localhost')?800:5000);
await p.evaluate(()=>document.querySelectorAll('#iubenda-cs-banner').forEach(e=>e.remove()));
const H = await p.evaluate(()=>document.documentElement.scrollHeight);
for (let y=0;y<H;y+=800){ await p.evaluate(v=>scrollTo(0,v),y); await p.waitForTimeout(80);} await p.evaluate(()=>scrollTo(0,1e7)); await p.waitForTimeout(1200);
await p.mouse.move(width/2, height/2);
const sample = () => p.evaluate(([ws,ps])=>{ const wr=document.querySelector(ws); const m=getComputedStyle(wr).transform; const ty=m==='none'?0:+m.split(',')[5].replace(')',''); const imgs=[...document.querySelectorAll(ps+' img')]; const shown=imgs.findIndex(i=>getComputedStyle(i).opacity==='1'); return [Math.round(ty*10)/10, shown, Math.round(scrollY)]; },[wrapSel,panelSel]);
const t0=Date.now(); const log=[];
// phase A: 24 wheel ticks of 100px, 50ms apart (a steady scroll), phase B: release
for (let i=0;i<24;i++){ await p.mouse.wheel(0,100); log.push([Date.now()-t0,'wheel', ...(await sample())]); if(shots&&i===12) await p.screenshot({path:shots+'-pulled.jpeg',type:'jpeg',quality:70}); await p.waitForTimeout(50);}
for (let i=0;i<30;i++){ log.push([Date.now()-t0,'rest', ...(await sample())]); await p.waitForTimeout(40);}
for (const r of log) console.log(r.join(' | '));
await b.close();
