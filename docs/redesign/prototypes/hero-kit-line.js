/* Outline-led character style for the revised hero (owner: "more of a Notion type design", outlines, few accent colours).
   Loaded after hero-kit.js. Overrides person, bubble, tile, flow and table. Placeholders until the sourcing choice. */
(function () {
  const K = window.Kit, INK = '#2b2118', PAPER = '#fffdf8', SW = 3.5;
  const ACC = { terra: '#d9694a', mustard: '#f2c14e', teal: '#4f9a9b', sage: '#a9c291' };

  // Outline-led: paper fill by default. An accent fill sits a few pixels off its line; that is the only colour.
  function shape(d, fill) {
    const f = fill || PAPER;
    if (f === PAPER) return `<path d="${d}" fill="${PAPER}" stroke="${INK}" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (f === INK) return `<path d="${d}" fill="${INK}" stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round"/>`;
    return `<path d="${d}" fill="${f}" transform="translate(3 3)"/>` +
           `<path d="${d}" fill="${PAPER}" fill-opacity="0" stroke="${INK}" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  function ell(cx, cy, rx, ry, fill) {
    const f = fill || PAPER;
    if (f === PAPER || f === INK) return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${f}" stroke="${INK}" stroke-width="${SW}"/>`;
    return `<ellipse cx="${cx + 3}" cy="${cy + 3}" rx="${rx}" ry="${ry}" fill="${f}"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${INK}" stroke-width="${SW}"/>`;
  }
  const line = (d, w) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w || SW}" stroke-linecap="round" stroke-linejoin="round"/>`;

  function person(o) {
    const shirt = o.accent || PAPER;          // accent colour only when asked for
    let back = '', front = '';
    switch (o.hair) {
      case 'bun':
        back += shape('M-33 -6 C-40 -50 -8 -60 8 -57 C30 -54 40 -34 33 -6 C26 -26 8 -34 -8 -30 C-20 -28 -28 -20 -33 -8 Z', INK) + ell(0, -64, 15, 14, INK); break;
      case 'curly':
        [[-28, -26], [-14, -42], [6, -47], [24, -38], [34, -18], [-36, -8], [36, 0]].forEach(p => back += ell(p[0], p[1], 15, 15, INK)); break;
      case 'long':
        back += shape('M-38 -8 C-46 -64 46 -64 38 -8 L46 78 L-46 78 Z', INK);
        front += shape('M-32 -10 C-30 -44 30 -44 32 -10 C20 -30 -18 -30 -32 -10 Z', INK); break;
      case 'scarf':
        back += shape('M-40 -4 C-46 -62 46 -62 40 -4 C44 30 54 52 62 80 L-62 80 C-54 52 -44 30 -40 -4 Z', o.scarfAccent || PAPER);
        front += line('M-30 -22 C-12 -34 14 -34 30 -22'); break;
      case 'bald': break;
      case 'crop':
        front += shape('M-33 -8 C-36 -50 36 -50 33 -8 C26 -28 -26 -28 -33 -8 Z', INK); break;
      default:
        front += shape('M-33 -8 C-38 -48 -10 -58 6 -55 C28 -52 38 -34 33 -8 C26 -26 8 -34 -8 -30 C-20 -28 -28 -20 -33 -8 Z', INK);
    }
    const torso = shape('M-64 160 C-66 70 -42 38 0 38 C42 38 66 70 64 160 Z', shirt) + line('M-20 40 Q0 60 20 40', 3);
    const neck = shape('M-11 26 L-11 46 Q0 54 11 46 L11 26 Z');
    const ears = o.hair === 'scarf' ? '' : ell(-31, 3, 5, 7) + ell(31, 3, 5, 7);
    const head = o.hair === 'scarf' ? ell(0, 0, 29, 33) : ell(0, 0, 31, 35);
    let face = `<circle cx="-11" cy="-2" r="3" fill="${INK}"/><circle cx="11" cy="-2" r="3" fill="${INK}"/>` + line('M-1 4 q-3 8 3 9', 2.6);
    face += o.talk ? `<path d="M-9 17 Q0 34 9 17 Z" fill="${PAPER}" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>` : line('M-8 19 Q0 25 8 19', 2.8);
    if (o.beard) face += line('M-24 14 Q-22 38 0 40 Q22 38 24 14', 3);
    if (o.glasses) face += `<circle cx="-11" cy="-2" r="10" fill="none" stroke="${INK}" stroke-width="2.8"/><circle cx="11" cy="-2" r="10" fill="none" stroke="${INK}" stroke-width="2.8"/>` + line('M-1 -2 H1', 2.8);
    let arm = '';
    if (o.gesture) {
      arm = `<path d="M52 84 C86 76 96 48 90 16" fill="none" stroke="${INK}" stroke-width="25" stroke-linecap="round"/>` +
            `<path d="M52 84 C86 76 96 48 90 16" fill="none" stroke="${shirt}" stroke-width="18" stroke-linecap="round"/>` + ell(90, 6, 11, 12);
    }
    const g = `<g filter="url(#wob2)">${back}${torso}${neck}${ears}${head}${front}${face}${arm}</g>`;
    const t = `translate(${o.x} ${o.y}) scale(${(o.flip ? -1 : 1) * (o.s || 1)} ${o.s || 1})`;
    return `<g transform="${t}">${g}</g>`;
  }

  function bubble(x, y, w, lines, o) {
    o = o || {};
    const lh = 24, h = lines.length * lh + 26, tail = o.tail || 'bl';
    const tx = tail.includes('l') ? x + 34 : x + w - 34, dir = tail.includes('l') ? -1 : 1;
    const ty = tail.includes('b') ? y + h : y, sg = tail.includes('b') ? 1 : -1;
    const text = lines.map((l, i) => `<text x="${x + 18}" y="${y + 33 + i * lh}" font-family="'Bradley Hand','Segoe Print','Comic Sans MS',cursive" font-size="20" fill="${INK}">${l}</text>`).join('');
    return `<g filter="url(#wob2)"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${PAPER}" stroke="${INK}" stroke-width="${SW}"/>` +
      `<path d="M${tx - 12} ${ty} L${tx + dir * 14} ${ty + sg * 26} L${tx + 14} ${ty}" fill="${PAPER}" stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round"/>` +
      `<path d="M${tx - 10} ${ty + 1.5} L${tx + 12} ${ty + 1.5}" stroke="${PAPER}" stroke-width="6"/></g>${text}`;
  }

  function tile(x, y, w, h, id, inner) {
    return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14"/></clipPath>` +
      `<rect x="${x + 3}" y="${y + 3}" width="${w}" height="${h}" rx="14" fill="${INK}"/>` +
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${PAPER}" stroke="${INK}" stroke-width="${SW}"/>` +
      `<g clip-path="url(#${id})">${inner}</g>`;
  }

  function svg(w, h, inner) {
    const defs = `<defs><filter id="wob2" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter>
      <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1 L9 5 L1 9" fill="none" stroke="#d9694a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Hand-drawn scene of a person on a call">${defs}${inner}</svg>`;
  }
  const flow = d => `<path d="${d}" fill="none" stroke="#d9694a" stroke-width="2.8" stroke-dasharray="3 9" stroke-linecap="round" marker-end="url(#arrow)"/>`;

  window.Kit2 = Object.assign({}, K, { person, bubble, tile, svg, flow, ACC });
})();
