/* Ink-line characters, three shape directions, for the B2 character question.
   Modelled on a close look at Notion's own drawings (rendered, not from memory): thin pen line, long angled nose,
   arched brows, tiny dot eyes, solid black hair, cross-hatched cloth, a collar or a button on every garment.
   Loaded after hero-kit.js. Placeholder art, drawn by code. */
(function () {
  const K = window.Kit, INK = '#2b2118', PAPER = '#fffdf8';
  const ACC = { terra: '#d9694a', mustard: '#f2c14e', teal: '#4f9a9b', sage: '#a9c291' };

  const DIR = {
    engraved: { sw: 2.4, hs: 1.0, neck: 18, W: 60, H: 210, aw: 11, reach: 1.0, hatch: true, face: 'threeq' },
    spare:    { sw: 3.8, hs: 1.05, neck: 10, W: 64, H: 210, aw: 14, reach: 0.9, hatch: false, face: 'minimal' },
    long:     { sw: 2.2, hs: 0.78, neck: 34, W: 46, H: 230, aw: 9, reach: 1.3, hatch: false, face: 'threeq' }
  };

  const P = (d, o) => {
    o = o || {};
    const fill = o.fill || 'none', stroke = o.stroke === undefined ? INK : o.stroke;
    return `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${o.sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  const accentFill = (d, colour, sw) =>
    `<path d="${d}" fill="${colour}" transform="translate(2.5 2.5)"/>` + P(d, { fill: PAPER, sw });

  function hand(x, y, rot, sw, kind) {
    const fingers = kind === 'chin'
      ? `<path d="M-9 -4 q-4 -6 -1 -10 M-3 -6 q-2 -8 2 -11 M3 -6 q1 -8 5 -9" fill="none" stroke="${INK}" stroke-width="${sw}" stroke-linecap="round"/>`
      : `<path d="M-8 -12 L-9 -26 M-2 -14 L-2 -30 M5 -13 L6 -28 M11 -9 L16 -21" fill="none" stroke="${INK}" stroke-width="${sw}" stroke-linecap="round"/>`;
    return `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M-11 6 C-14 -6 -12 -14 -3 -14 C8 -15 14 -8 12 6 C10 14 -8 14 -11 6 Z" fill="${PAPER}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round"/>${fingers}</g>`;
  }

  function person(o) {
    const D = DIR[o.dir || 'engraved'], sw = D.sw, hs = D.hs;
    const S = 34 * hs + D.neck, W = D.W, H = D.H;
    const sleeve = o.accent ? o.accent : PAPER;
    let back = '', front = '';

    // hair, for a head facing right; solid ink like the references
    switch (o.hair) {
      case 'bun':
        back += P('M-27 -2 C-34 -46 2 -56 20 -42 C8 -40 -6 -38 -14 -28 C-20 -20 -22 -10 -24 6 Z', { fill: INK, sw }) + P('M-26 -50 C-26 -62 -8 -66 -2 -56 C2 -46 -6 -40 -16 -42 C-22 -43 -26 -46 -26 -50 Z', { fill: INK, sw }); break;
      case 'curly':
        back += P('M-26 18 C-40 8 -38 -6 -34 -14 C-42 -24 -30 -36 -20 -34 C-18 -46 -2 -52 8 -46 C16 -54 30 -46 28 -36 C38 -32 34 -20 28 -16 C22 -26 6 -30 -8 -24 C-18 -18 -22 -6 -22 6 C-22 12 -24 16 -26 18 Z', { fill: INK, sw }); break;
      case 'crop':
        back += P('M-27 -4 C-34 -46 4 -56 26 -38 C18 -36 6 -34 -2 -28 C-12 -22 -20 -14 -24 6 Z', { fill: INK, sw }); break;
      case 'scarf':
        back += accentFill('M-34 30 C-46 -40 -8 -62 20 -46 C36 -36 34 -10 30 6 L44 ' + (S + 28) + ' L-44 ' + (S + 28) + ' Z', o.scarfAccent || ACC.sage, sw); break;
      case 'bald': break;
      default:
        back += P('M-27 -4 C-34 -46 4 -56 26 -38 C18 -36 6 -34 -2 -28 C-12 -22 -20 -14 -24 6 Z', { fill: INK, sw });
    }

    // head, three-quarter, nose out to the right
    const headPath = 'M-26 -6 C-28 -34 -8 -44 8 -42 C26 -40 30 -20 29 -4 L36 14 L29 18 C28 30 14 38 -2 36 C-18 34 -26 20 -26 -6 Z';
    let head = P(headPath, { fill: PAPER, sw });
    if (o.hair === 'scarf') head += P('M-6 -40 C10 -38 26 -30 29 -6', { sw }); // scarf edge across the brow
    let face = '';
    if (D.face === 'threeq') {
      face += `<path d="M6 -14 Q14 -21 22 -15" fill="none" stroke="${INK}" stroke-width="${sw}" stroke-linecap="round"/>`;
      face += `<circle cx="14" cy="-6" r="2.3" fill="${INK}"/><circle cx="25" cy="-5" r="1.8" fill="${INK}"/>`;
      face += o.talk
        ? `<path d="M12 22 Q20 32 27 22 Z" fill="${PAPER}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round"/>`
        : `<path d="M12 24 Q20 27 27 23" fill="none" stroke="${INK}" stroke-width="${sw}" stroke-linecap="round"/>`;
      face += `<path d="M-6 0 q-5 5 -1 12" fill="none" stroke="${INK}" stroke-width="${sw}" stroke-linecap="round"/>`; // ear
      if (o.glasses) face += `<circle cx="14" cy="-6" r="9" fill="none" stroke="${INK}" stroke-width="${sw}"/><circle cx="27" cy="-5" r="6" fill="none" stroke="${INK}" stroke-width="${sw}"/><path d="M-12 -8 L5 -7" stroke="${INK}" stroke-width="${sw}"/>`;
      if (o.beard) face += `<path d="M-14 14 Q-10 38 12 38 Q26 36 29 20" fill="none" stroke="${INK}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="1 4"/>`;
    } else {
      // spare: a hooked nose, two dots and a brow, the way Notion draws a face in one stroke
      face += `<path d="M6 -16 Q12 -22 20 -16" fill="none" stroke="${INK}" stroke-width="${sw}" stroke-linecap="round"/>`;
      face += `<circle cx="10" cy="-6" r="2.6" fill="${INK}"/><circle cx="24" cy="-6" r="2.6" fill="${INK}"/>`;
      face += `<path d="M18 -4 L16 14 L26 14" fill="none" stroke="${INK}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
      if (o.talk) face += `<path d="M12 26 Q20 33 28 26" fill="none" stroke="${INK}" stroke-width="${sw}" stroke-linecap="round"/>`;
      if (o.glasses) face += `<circle cx="10" cy="-6" r="9" fill="none" stroke="${INK}" stroke-width="${sw}"/><circle cx="24" cy="-6" r="9" fill="none" stroke="${INK}" stroke-width="${sw}"/>`;
    }

    // neck and torso
    const neck = P(`M-8 ${30 * hs} L-9 ${S + 4} M7 ${33 * hs} L9 ${S + 4}`, { sw });
    const torsoD = `M-11 ${S} C${-W * .6} ${S + 2} ${-W} ${S + 14} ${-W - 3} ${S + 44} L${-W + 3} ${H} L${W - 3} ${H} L${W + 3} ${S + 44} C${W} ${S + 14} ${W * .6} ${S + 2} 11 ${S} Z`;
    let torso = P(torsoD, { fill: o.hatch && D.hatch ? 'url(#hatch)' : (o.accent && !o.sleeveOnly ? 'none' : PAPER), sw });
    if (o.hatch && D.hatch) torso = P(torsoD, { fill: PAPER, sw }) + P(torsoD, { fill: 'url(#hatch)', stroke: 'none' }) + P(torsoD, { sw });
    if (o.accent && !o.hatch) torso = `<path d="${torsoD}" fill="${o.accent}" transform="translate(2.5 2.5)"/>` + P(torsoD, { fill: PAPER, sw });
    // collar, placket, pocket
    const collar = P(`M-11 ${S} L-4 ${S + 18} L0 ${S + 4} L4 ${S + 18} L11 ${S}`, { sw }) +
                   P(`M0 ${S + 18} L0 ${S + 90}`, { sw }) + `<circle cx="0" cy="${S + 40}" r="2" fill="${INK}"/><circle cx="0" cy="${S + 64}" r="2" fill="${INK}"/>` +
                   (o.pocket ? P(`M${W * .35} ${S + 70} h22 v24 h-22 Z`, { sw }) : '');

    // arms: a tube is an ink stroke with a paper stroke inside, so it reads as two thin lines
    const tube = (d, w) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + sw * 1.4}" stroke-linecap="round" stroke-linejoin="round"/>` +
                           `<path d="${d}" fill="none" stroke="${sleeve}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    let arm = '';
    const r = D.reach, ax = W - 4, ay = S + 22;
    if (o.gesture) {
      const ex = ax + 34 * r, ey = ay + 56 * r, wx = ex + 14 * r, wy = ey - 70 * r;
      arm = tube(`M${ax} ${ay} L${ex} ${ey} L${wx} ${wy}`, D.aw) + hand(wx, wy - 6, 8, sw, 'open');
    } else if (o.chin) {
      const ex = ax - 2, ey = ay + 80 * r, wx = 22 * hs, wy = 36 * hs + 10;
      arm = tube(`M${ax - 8} ${ay} L${ex} ${ey} L${wx} ${wy + 24}`, D.aw) + hand(wx - 2, wy + 22, -20, sw, 'chin');
    } else if (o.rest) {
      const ex = ax - 4, ey = ay + 84 * r;
      arm = tube(`M${ax - 8} ${ay} L${ex} ${ey} L${ex - 40 * r} ${ey + 8}`, D.aw);
    }
    const prop = o.mug ? `<g transform="translate(${-W - 24} ${H - 62})">${accentFill('M0 0 H30 V34 Q30 42 22 42 H8 Q0 42 0 34 Z', o.mug, sw)}${P('M30 8 q12 2 10 14 q-2 8 -10 6', { sw })}</g>` : '';

    const g = `<g filter="url(#inkwob)"><g transform="scale(${hs}) translate(0 0)"></g>${back}${torso}${collar}${neck}${head}${face}${o.hair === 'scarf' ? '' : ''}</g>`;
    // the head group is scaled, the body group is not; draw head last, scaled about its centre
    const bodyParts = `${torso}${collar}${neck}${arm}${prop}`;
    const headParts = `<g transform="scale(${hs})">${back}${head}${front}${face}</g>`;
    const t = `translate(${o.x} ${o.y}) scale(${(o.flip ? -1 : 1) * (o.s || 1)} ${o.s || 1})`;
    return `<g transform="${t}"><g filter="url(#inkwob)">${o.hair === 'scarf' ? '' : ''}${bodyParts}${headParts}</g></g>`;
  }

  const SWB = 2.6;
  function bubble(x, y, w, lines, o) {
    o = o || {};
    const lh = 24, h = lines.length * lh + 26, tail = o.tail || 'bl';
    const tx = tail.includes('l') ? x + 34 : x + w - 34, dir = tail.includes('l') ? -1 : 1;
    const ty = tail.includes('b') ? y + h : y, sg = tail.includes('b') ? 1 : -1;
    const text = lines.map((l, i) => `<text x="${x + 18}" y="${y + 33 + i * lh}" font-family="'Bradley Hand','Segoe Print','Comic Sans MS',cursive" font-size="20" fill="${INK}">${l}</text>`).join('');
    return `<g filter="url(#inkwob)"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${PAPER}" stroke="${INK}" stroke-width="${SWB}"/>` +
      `<path d="M${tx - 12} ${ty} L${tx + dir * 14} ${ty + sg * 24} L${tx + 14} ${ty}" fill="${PAPER}" stroke="${INK}" stroke-width="${SWB}" stroke-linejoin="round"/>` +
      `<path d="M${tx - 10} ${ty + 1.2} L${tx + 12} ${ty + 1.2}" stroke="${PAPER}" stroke-width="5"/></g>${text}`;
  }
  const flow = d => `<path d="${d}" fill="none" stroke="#d9694a" stroke-width="2.6" stroke-dasharray="3 9" stroke-linecap="round" marker-end="url(#arrow2)"/>`;

  function table(x, y, w, h) {
    return `<g filter="url(#inkwob)"><path d="M${x} ${y} H${x + w}" stroke="${INK}" stroke-width="${SWB}" stroke-linecap="round"/>` +
      `<path d="M${x} ${y + 14} H${x + w}" stroke="${INK}" stroke-width="${SWB}" stroke-linecap="round" opacity=".0"/>` +
      `<path d="M${x + 40} ${y + 20} H${x + w * .35} M${x + w * .55} ${y + 30} H${x + w - 80}" stroke="${INK}" stroke-width="1.6" stroke-linecap="round" opacity=".5"/></g>`;
  }

  function svg(w, h, inner, label) {
    const defs = `<defs>
      <filter id="inkwob" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="11" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" xChannelSelector="R" yChannelSelector="G"/></filter>
      <pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><line x1="0" y1="0" x2="0" y2="5" stroke="${INK}" stroke-width="1.1"/></pattern>
      <marker id="arrow2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1 L9 5 L1 9" fill="none" stroke="#d9694a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label || 'Hand-drawn people at a table'}">${defs}${inner}</svg>`;
  }

  window.Ink = Object.assign({}, K, { person, bubble, flow, table, svg, ACC });
})();
