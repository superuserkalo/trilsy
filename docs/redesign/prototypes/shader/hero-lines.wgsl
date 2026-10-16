// REJECTED at Gate C (2026-10-15): the owner chose no shader on the site. Kept as history; do not build.
// Direction 3, "ruled voice": the lines of a notebook page across the blue band. At rest they are straight,
// like the page the notes will be written on. When someone speaks, every rule near them carries the voice as
// a smooth wave in rounded swells, each a little out of step with its neighbour, and settles flat again.
// Original Trilsy artwork, written for this site. One fragment pass. Units are device pixels.
struct Params { time: f32, level_a: f32, level_b: f32, dpr: f32, size: vec2f, a_pos: vec2f, b_pos: vec2f }
@group(0) @binding(0) var<uniform> params: Params;

const PAPER = vec3f(0.8627, 0.9020, 0.9490); // #DCE6F2, the band
const INK = vec3f(0.1412, 0.1176, 0.0941);   // #241E18, the site ink
const MID = 255.0;                           // css px from the top of the band to the waveform's centre line

fn hash11(x: f32) -> f32 { return fract(sin(x * 127.1) * 43758.5453); }
fn vnoise(x: f32) -> f32 {
  let i = floor(x);
  let f = fract(x);
  let u = f * f * (3.0 - 2.0 * f);
  return mix(hash11(i), hash11(i + 1.0), u);
}

// How loud the room is at column x (0 to 1): each speaker is loudest at their own position and the sound
// thins out with distance. A speaker only counts while their level is up, and each word is a swell that
// leaves the speaker and travels outward, so the envelope is smooth and moves like speech.
fn envelope(x: f32) -> f32 {
  var e = 0.03;
  let c = 700.0 * params.dpr; // how fast a word travels, device px per second
  let da = abs(x - params.a_pos.x);
  let db = abs(x - params.b_pos.x);
  let wa = 0.3 + 0.7 * pow(abs(sin((params.time - da / c) * 2.6)), 0.6);
  let wb = 0.3 + 0.7 * pow(abs(sin((params.time - db / c) * 2.9 + 1.3)), 0.6);
  e += params.level_a * wa * exp(-pow(da / (520.0 * params.dpr), 1.6));
  e += params.level_b * wb * exp(-pow(db / (520.0 * params.dpr), 1.6));
  return min(e, 1.0);
}

// A smooth voice-like carrier: two sines that drift against each other. Between -1 and 1.
fn carrier(x: f32, phase: f32, spread: f32) -> f32 {
  let u = x / params.dpr;
  return 0.65 * sin(u * 0.030 * spread - params.time * 5.0 + phase)
       + 0.35 * sin(u * 0.067 * spread + params.time * 3.6 + 1.3 * phase);
}

// Rounded lobes between 0 and 1, like the swells of syllables seen from far away.
fn lobes(x: f32, phase: f32) -> f32 {
  let u = x / params.dpr;
  let a = 0.5 + 0.5 * sin(u * 0.024 - params.time * 2.4 + phase);
  let b = 0.5 + 0.5 * sin(u * 0.052 + params.time * 1.7 + 2.0 * phase);
  return 0.30 + 0.70 * (0.65 * a * a + 0.35 * b);
}

const SPACING = 34.0; // css px between rules

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let p = uv * params.size;
  let sp = SPACING * params.dpr;
  let row0 = floor(p.y / sp);
  var cover = 0.0;
  for (var j = -2; j <= 2; j++) {
    let i = row0 + f32(j);
    let base = (i + 0.5) * sp;
    let wob = (vnoise(p.x * 0.0035 / params.dpr + i * 17.3) - 0.5) * 3.0 * params.dpr;
    let amp = 17.0 * params.dpr;
    let dx = 2.0 * params.dpr;
    let ra = (base - params.a_pos.y) / (260.0 * params.dpr);
    let rb = (base - params.b_pos.y) / (260.0 * params.dpr);
    let reach = max(exp(-ra * ra), exp(-rb * rb));
    let ph = i * 0.35;
    let y_a = base + wob + amp * reach * envelope(p.x) * lobes(p.x, ph) * carrier(p.x, ph, 1.5);
    let y_b = base + wob + amp * reach * envelope(p.x + dx) * lobes(p.x + dx, ph) * carrier(p.x + dx, ph, 1.5);
    let slope = (y_b - y_a) / dx;
    let d = abs(p.y - y_a) / sqrt(1.0 + slope * slope);
    let hw = 0.7 * params.dpr;
    let line = 1.0 - smoothstep(hw, hw + 0.8 * params.dpr, d);
    cover = max(cover, line * mix(0.12, 0.26, hash11(i * 3.7)));
  }
  let edge = 40.0 * params.dpr;
  let fade = smoothstep(0.0, edge, p.y) * smoothstep(0.0, edge, params.size.y - p.y);
  return vec4f(mix(PAPER, INK, cover * fade), 1.0);
}
