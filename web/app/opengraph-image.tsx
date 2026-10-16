import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { home } from "@/lib/metadata";
import { ogFonts } from "@/lib/og-fonts";

// The share image for every route: the hero's headline on the paper colour, the
// second sentence on a flat mustard band, the hero's subhead, and the domain.
// Colours are the tokens in app/globals.css (ImageResponse cannot read CSS
// variables). No price, ever (master). The wordmark is plain type: TODO: logo.
// Two of the hero's hand-drawn people stand on the right, cropped at the waist as
// they are in the hero, on the pale blue field band along the bottom.
export const alt = home.ogTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The pack SVGs (public/characters) as data URIs, because ImageResponse cannot fetch files.
async function figure(name: string) {
  const svg = await readFile(path.join(process.cwd(), "public/characters", `${name}.svg`));
  return `data:image/svg+xml;base64,${svg.toString("base64")}`;
}

export default async function Image() {
  const [fonts, marcus, priya] = await Promise.all([
    ogFonts(),
    figure("12-mustard-gesture"),
    figure("07-sage-curls"),
  ]);
  const display = fonts.length ? "Fraunces" : undefined;
  const sans = fonts.length ? "Figtree" : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#fbf7ee",
          color: "#241e18",
          fontFamily: sans,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: 390,
            background: "#dce6f2",
            display: "flex",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={marcus} alt="" width={280} height={520} style={{ position: "absolute", left: -30, bottom: -170 }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={priya}
            alt=""
            width={280}
            height={520}
            style={{ position: "absolute", left: 120, bottom: -170, transform: "scaleX(-1)" }}
          />
        </div>
        <div style={{ display: "flex", fontFamily: display, fontSize: 40, fontWeight: 600 }}>Trilsy</div>
        <div style={{ display: "flex", flexDirection: "column", fontFamily: display, fontWeight: 600 }}>
          <div style={{ display: "flex", fontSize: 68, lineHeight: 1.08, letterSpacing: "-0.015em" }}>
            Be in the conversation.
          </div>
          <div style={{ display: "flex", marginTop: 8 }}>
            <div
              style={{
                display: "flex",
                fontSize: 68,
                lineHeight: 1.08,
                letterSpacing: "-0.015em",
                padding: "0 14px",
                marginLeft: -14,
                background: "rgba(230, 171, 79, 0.74)",
                borderRadius: 6,
              }}
            >
              Trilsy writes the notes.
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 32,
              fontFamily: sans,
              fontWeight: 500,
              fontSize: 28,
              lineHeight: 1.35,
              color: "rgba(36, 30, 24, 0.8)",
              maxWidth: 700,
            }}
          >
            Record your microphone, your Mac&rsquo;s sound or both. Trilsy transcribes it and writes notes you can edit.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, fontWeight: 500, color: "#6e6354" }}>
          trilsy.com · Apple silicon, macOS 15 or later
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
