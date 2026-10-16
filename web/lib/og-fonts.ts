// Fonts for the generated share image. ImageResponse needs TTF or OTF data, and
// next/font only ships WOFF2, so the two faces are fetched from Google Fonts once,
// when the image is generated at build time. If the fetch fails the image still
// builds, in ImageResponse's default sans, rather than failing the deploy.

type OgFont = { name: string; data: ArrayBuffer; weight: 500 | 600; style: "normal" };

async function load(family: string, axes: string, weight: 500 | 600, name: string) {
  const css = await fetch(`https://fonts.googleapis.com/css2?family=${family}:${axes}&display=swap`).then(
    (r) => r.text(),
  );
  const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
  if (!url) throw new Error(`No TTF for ${family}`);
  const data = await fetch(url).then((r) => r.arrayBuffer());
  return { name, data, weight, style: "normal" } satisfies OgFont;
}

export async function ogFonts(): Promise<OgFont[]> {
  try {
    return await Promise.all([
      load("Fraunces", "opsz,wght@72,600", 600, "Fraunces"),
      load("Figtree", "wght@500", 500, "Figtree"),
    ]);
  } catch {
    return [];
  }
}
