// REJECTED at Gate C (2026-10-15): the owner chose no shader on the site. Kept as history; do not build.
// Direction 1, "strands": five hair-thin ink strands that together draw one voice, running the full width of
// the blue band. Quiet, they are a nearly flat line. When someone speaks the strands swell around them and
// ripple outward, the way a recorded voice looks on a screen. Smooth sines throughout, no bars.
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

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let p = uv * params.size;
  let y0 = MID * params.dpr;
  let amp = 135.0 * params.dpr;
  var cover = 0.0;
  for (var i = 0; i < 5; i++) {
    let s = f32(i) - 2.0;
    let off = s * 7.0 * params.dpr;
    let phase = s * 0.30;
    let scale = 1.0 - 0.12 * abs(s);
    let dx = 2.0 * params.dpr;
    let f0 = y0 + off + amp * scale * envelope(p.x) * lobes(p.x, phase) * carrier(p.x, phase, 1.0);
    let f1 = y0 + off + amp * scale * envelope(p.x + dx) * lobes(p.x + dx, phase) * carrier(p.x + dx, phase, 1.0);
    let slope = (f1 - f0) / dx;
    let d = abs(p.y - f0) / sqrt(1.0 + slope * slope);
    let w = 0.8 * params.dpr;
    let line = 1.0 - smoothstep(w, w + 0.9 * params.dpr, d);
    cover = max(cover, line * (0.32 - 0.07 * abs(s)));
  }
  let edge = 30.0 * params.dpr;
  let fade = smoothstep(0.0, edge, p.x) * smoothstep(0.0, edge, params.size.x - p.x);
  return vec4f(mix(PAPER, INK, cover * fade), 1.0);
}
