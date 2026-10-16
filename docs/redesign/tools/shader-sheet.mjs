// Builds a labelled contact sheet from docs/redesign/refs/shaders/*.jpeg. Run from web/: node ../docs/redesign/tools/shader-sheet.mjs
import { createRequire } from 'node:module';
const sharp = createRequire(new URL('../../../web/package.json', import.meta.url))('sharp');
const dir = new URL('../refs/shaders/', import.meta.url).pathname;
const names = process.argv.slice(2);
const W = 640, H = 346, cols = 3, rows = Math.ceil(names.length / cols);
const layers = [];
for (let i = 0; i < names.length; i++) {
  const buf = await sharp(dir + names[i] + '.jpeg').resize(W, H, { fit: 'cover' }).toBuffer();
  const x = (i % cols) * W, y = Math.floor(i / cols) * H;
  layers.push({ input: buf, left: x, top: y });
  const svg = `<svg width="${W}" height="30" xmlns="http://www.w3.org/2000/svg"><rect width="${W}" height="30" fill="#000" fill-opacity="0.6"/><text x="10" y="21" font-family="Helvetica" font-size="16" fill="#fff">${i + 1}. ${names[i]}</text></svg>`;
  layers.push({ input: Buffer.from(svg), left: x, top: y });
}
await sharp({ create: { width: W * cols, height: H * rows, channels: 3, background: '#222' } }).composite(layers).jpeg({ quality: 78 }).toFile(dir + 'contact-sheet.jpeg');
