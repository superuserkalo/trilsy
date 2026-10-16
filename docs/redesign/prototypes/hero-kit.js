/* Throwaway kit for the B2 hero previews. Hand-drawn style is made by code here:
   uneven ink strokes (SVG displacement), flat fills nudged off the line, one ink colour.
   Palette, type and the characters themselves are placeholders until B4 and the sourcing choice. */
(function () {
  const INK = '#2b2118';
  const SKIN = { a: '#f2c9a5', b: '#d9a077', c: '#a86b45', d: '#6f4328' };
  const SW = 3;

  const defs = `
  <defs>
    <filter id="wob" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="4" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M1 1 L9 5 L1 9" fill="none" stroke="#c8553d" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>`;

  // A filled shape whose fill sits a few pixels off its outline, like a two-pass print.
  function shape(d, fill, extra) {
    extra = extra || '';
    return `<path d="${d}" fill="${fill}" transform="translate(2.5 2.5)" stroke="none"/>` +
           `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
  }
  function ell(cx, cy, rx, ry, fill) {
    return `<ellipse cx="${cx + 2.5}" cy="${cy + 2.5}" rx="${rx}" ry="${ry}" fill="${fill}"/>` +
           `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${INK}" stroke-width="${SW}"/>`;
  }

  /* One seated upper body. Origin is the centre of the head. */
  function person(o) {
    const skin = SKIN[o.skin || 'a'];
    const hair = o.hairColor || '#3a2a20';
    const shirt = o.shirt || '#2f6f73';
    let back = '', front = '', face = '';
    switch (o.hair) {
      case 'bun':
        back += shape('M-33 -6 C-40 -50 -8 -60 8 -57 C30 -54 40 -34 33 -6 C26 -26 8 -34 -8 -30 C-20 -28 -28 -20 -33 -8 Z', hair);
        back += ell(0, -62, 15, 14, hair);
        break;
      case 'curly':
        [[-28, -26], [-14, -42], [6, -47], [24, -38], [34, -18], [-36, -8], [36, 0]].forEach(p => back += ell(p[0], p[1], 15, 15, hair));
        break;
      case 'long':
        back += shape('M-38 -8 C-46 -64 46 -64 38 -8 L46 78 L-46 78 Z', hair);
        front += shape('M-32 -10 C-30 -44 30 -44 32 -10 C20 -30 -18 -30 -32 -10 Z', hair);
        break;
      case 'scarf':
        back += shape('M-40 -4 C-46 -62 46 -62 40 -4 C44 30 54 52 62 80 L-62 80 C-54 52 -44 30 -40 -4 Z', hair);
        break;
      case 'bald':
        break;
      default:
        front += shape('M-33 -8 C-38 -48 -10 -58 6 -55 C28 -52 38 -34 33 -8 C26 -26 8 -34 -8 -30 C-20 -28 -28 -20 -33 -8 Z', hair);
    }
    // torso then neck then head
    const torso = shape('M-64 160 C-66 70 -42 38 0 38 C42 38 66 70 64 160 Z', shirt);
    const neck = shape('M-11 26 L-11 46 Q0 56 11 46 L11 26 Z', skin);
    const head = (o.hair === 'scarf') ? ell(0, 0, 29, 33, skin) : ell(0, 0, 31, 35, skin);
    const ears = o.hair === 'scarf' ? '' : ell(-31, 3, 5, 7, skin) + ell(31, 3, 5, 7, skin);
    face += `<circle cx="-11" cy="-2" r="2.8" fill="${INK}"/><circle cx="11" cy="-2" r="2.8" fill="${INK}"/>`;
    face += `<path d="M-17 -11 Q-11 -15 -5 -11 M5 -11 Q11 -15 17 -11" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`;
    face += `<path d="M0 3 q-3 8 3 9" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`;
    face += o.talk
      ? `<path d="M-9 17 Q0 34 9 17 Z" fill="#8a3a30" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>`
      : `<path d="M-8 19 Q0 24 8 19" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`;
    face += `<circle cx="-20" cy="12" r="6" fill="#e58b7a" opacity=".35"/><circle cx="20" cy="12" r="6" fill="#e58b7a" opacity=".35"/>`;
    if (o.glasses) face += `<circle cx="-11" cy="-2" r="9.5" fill="none" stroke="${INK}" stroke-width="2.4"/><circle cx="11" cy="-2" r="9.5" fill="none" stroke="${INK}" stroke-width="2.4"/><path d="M-1.5 -2 H1.5" stroke="${INK}" stroke-width="2.4"/>`;
    // raised arm, drawn as an outlined sleeve ending in a hand
    let arm = '';
    if (o.gesture) {
      arm = `<path d="M52 84 C86 76 96 48 90 16" fill="none" stroke="${INK}" stroke-width="23" stroke-linecap="round"/>` +
            `<path d="M52 84 C86 76 96 48 90 16" fill="none" stroke="${shirt}" stroke-width="17" stroke-linecap="round"/>` +
            ell(90, 6, 11, 12, skin);
    }
    let held = '';
    if (o.held === 'mug') {
      held = shape('M-88 110 L-88 140 Q-88 150 -78 150 L-62 150 Q-52 150 -52 140 L-52 110 Z', '#e0a83a') +
             `<path d="M-52 118 q14 2 12 14 q-2 10 -12 8" fill="none" stroke="${INK}" stroke-width="${SW}"/>`;
    }
    const g = `<g filter="url(#wob)">${back}${torso}${neck}${o.hair === 'scarf' ? '' : ''}${ears}${head}${front}${face}${arm}${held}</g>`;
    const t = `translate(${o.x} ${o.y}) scale(${(o.flip ? -1 : 1) * (o.s || 1)} ${o.s || 1})`;
    return `<g transform="${t}">${g}</g>`;
  }

  function laptopBack(x, y, w) {
    const h = w * 0.62;
    return `<g filter="url(#wob)" transform="translate(${x} ${y})">` +
      shape(`M0 ${h} L${w * 0.04} 0 L${w * 0.96} 0 L${w} ${h} Z`, '#d9d6cf') +
      `<circle cx="${w / 2}" cy="${h / 2}" r="${w * 0.045}" fill="none" stroke="${INK}" stroke-width="2.4"/>` +
      shape(`M-10 ${h} L${w + 10} ${h} L${w + 4} ${h + 12} L-4 ${h + 12} Z`, '#bdb9b0') + `</g>`;
  }

  function table(x, y, w, h, fill) {
    return `<g filter="url(#wob)">` +
      shape(`M${x} ${y} L${x + w} ${y} L${x + w} ${y + h} L${x} ${y + h} Z`, fill || '#d9a86a') +
      `<path d="M${x + 30} ${y + 22} H${x + w * 0.4} M${x + w * 0.55} ${y + 34} H${x + w - 60}" stroke="${INK}" stroke-width="2" opacity=".35" stroke-linecap="round"/></g>`;
  }

  // Speech bubble with a dashed outline in the Graza manner; text is set in a handwriting font.
  function bubble(x, y, w, lines, o) {
    o = o || {};
    const lh = 24, h = lines.length * lh + 26;
    const tail = o.tail || 'bl';
    const tx = tail.includes('l') ? x + 34 : x + w - 34;
    const dir = tail.includes('l') ? -1 : 1;
    const ty = tail.includes('b') ? y + h : y;
    const sgn = tail.includes('b') ? 1 : -1;
    const tailPath = `M${tx - 12} ${ty} L${tx + dir * 14} ${ty + sgn * 26} L${tx + 14} ${ty}`;
    const text = lines.map((l, i) => `<text x="${x + 18}" y="${y + 33 + i * lh}" font-family="'Bradley Hand','Segoe Print','Comic Sans MS',cursive" font-size="20" fill="${INK}">${l}</text>`).join('');
    return `<g>` +
      `<g filter="url(#wob)"><rect x="${x + 3}" y="${y + 3}" width="${w}" height="${h}" rx="18" fill="${o.fill || '#f7d9a6'}"/>` +
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#fffdf8" stroke="${INK}" stroke-width="${SW}"/>` +
      `<path d="${tailPath}" fill="#fffdf8" stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round"/>` +
      `<path d="M${tx - 10} ${ty + 1.5} L${tx + 12} ${ty + 1.5}" stroke="#fffdf8" stroke-width="5"/></g>${text}</g>`;
  }

  function flow(d) {
    return `<path d="${d}" fill="none" stroke="#c8553d" stroke-width="2.6" stroke-dasharray="3 9" stroke-linecap="round" marker-end="url(#arrow)" filter="url(#wob)"/>`;
  }

  /* The product window. Real-looking content; this is an illustration, not a native screenshot. */
  function win(o) {
    const lines = o.transcript.map((l, i) => `
      <div class="ln"><span class="chip" style="--c:${l.c}">${l.who}</span><time>${l.t}</time>
      <p>${l.text}${i === o.transcript.length - 1 && o.live ? '<i class="caret"></i>' : ''}</p></div>`).join('');
    const n = o.notes;
    const notes = `
      <h4>Overview</h4><p>${n.overview}</p>
      <h4>${n.t2 || 'Decisions'}</h4><ul>${n.decisions.map(d => `<li>${d}</li>`).join('')}</ul>
      <h4>${n.t3 || 'Actions'}</h4><ul class="todo">${n.actions.map(d => `<li><b></b>${d}</li>`).join('')}</ul>`;
    return `
    <div class="win" style="width:${o.w}px">
      <div class="bar"><span class="dots"><i></i><i></i><i></i></span><strong>${o.tabs || o.title}</strong><span class="rec"><i></i>${o.time}</span></div>
      ${o.tabs ? `<div class="doc">${o.title}</div>` : ''}
      <div class="cols">
        <section class="tr"><h3>Transcript</h3>
          <div class="wave">${Array.from({ length: 34 }, (_, i) => `<i style="height:${6 + Math.abs(Math.sin(i * 1.7) * 14 + Math.sin(i * .6) * 8)}px"></i>`).join('')}</div>
          ${lines}
          <button class="make">Create notes</button>
        </section>
        <section class="nt"><h3>Notes</h3>${notes}</section>
      </div>
    </div>`;
  }

  function svg(w, h, inner) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Hand-drawn meeting scene">${defs}${inner}</svg>`;
  }

  function tile(x, y, w, h, id, inner, fill) {
    return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14"/></clipPath>` +
      `<rect x="${x + 3}" y="${y + 3}" width="${w}" height="${h}" rx="14" fill="${INK}"/>` +
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${fill || '#f4ecdd'}" stroke="${INK}" stroke-width="${SW}"/>` +
      `<g clip-path="url(#${id})">${inner}</g>`;
  }
  window.Kit = { tile, person, laptopBack, table, bubble, flow, win, svg, INK };
})();
