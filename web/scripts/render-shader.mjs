import { readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { init, effect, target } from "vgpu/node";
import sharp from "sharp";
const video = process.argv.includes("--video");
const gpu = await init();
let failures = [];
gpu.onError((e) => failures.push(String(e)));
try {
  const width = 800,
    height = 800;
  const out = target(gpu, { size: [width, height] });
  const paint = effect(gpu, readFileSync("app/ripple.wgsl", "utf8"), {
    set: { params: { time: 0, aspect: width / height, pointer: [0.5, 0.5] } },
  });
  await paint.compile(out);
  paint.draw(out);
  const first = await out.color.read({ mipLevel: 0, region: "all" });
  await sharp(Buffer.from(first), { raw: { width, height, channels: 4 } })
    .webp({ quality: 92 })
    .toFile("public/light-field.webp");
  paint.set({ params: { time: 5 } });
  paint.draw(out);
  const later = await out.color.read({ mipLevel: 0, region: "all" });
  let changed = 0;
  for (let i = 0; i < first.length; i += 4)
    if (Math.abs(first[i] - later[i]) > 8) changed++;
  if (changed < 5000)
    throw new Error("Sculpture animation has insufficient movement");
  paint.set({ params: { time: 10 } });
  paint.draw(out);
  const last = await out.color.read({ mipLevel: 0, region: "all" });
  let seam = 0;
  for (let i = 0; i < first.length; i++) seam += Math.abs(first[i] - last[i]);
  if (seam / first.length > 1)
    throw new Error("Animation loop has a visible seam");
  if (video) {
    const encoder = spawn(
      "ffmpeg",
      [
        "-y",
        "-f",
        "rawvideo",
        "-pixel_format",
        "rgba",
        "-video_size",
        `${width}x${height}`,
        "-framerate",
        "24",
        "-i",
        "-",
        "-c:v",
        "libx264",
        "-preset",
        "slow",
        "-crf",
        "25",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        "-an",
        "public/glass-loop.mp4",
      ],
      { stdio: ["pipe", "ignore", "pipe"] },
    );
    let stderr = "";
    encoder.stderr.on("data", (b) => (stderr += b));
    const finished = once(encoder, "close");
    for (let i = 0; i < 240; i++) {
      paint.set({ params: { time: i / 24 } });
      paint.draw(out);
      const bytes = await out.color.read({ mipLevel: 0, region: "all" });
      if (!encoder.stdin.write(Buffer.from(bytes)))
        await once(encoder.stdin, "drain");
      if (i % 60 === 0) console.log(`Rendered ${i}/240 frames`);
    }
    encoder.stdin.end();
    const [code] = await finished;
    if (code !== 0) throw new Error(stderr);
  }
  await gpu.settled();
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(
    JSON.stringify({
      changedPixels: changed,
      loopMeanError: seam / first.length,
      video,
    }),
  );
} finally {
  gpu.dispose();
}
