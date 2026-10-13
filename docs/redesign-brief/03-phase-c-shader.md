# Phase C: vgpu shader choice (no code yet)

Read `00-master.md` and `/docs/redesign/STATE.md`.

vgpu is Vercel's open-source WebGPU library (`pnpm add vgpu`, MIT). Its site https://vgpu.sh has a gallery of published examples (fluid simulations, ocean particles, gradients, depth estimation and more). Typed `.wgsl` shader modules can be imported and reused like TypeScript modules, and the site exposes an examples discovery API (check the docs for how to list and fetch). I once had a specific example link and lost it. If vgpu.sh cannot be opened, stop and ask me. Do not substitute your own shader.

1. Read the **entire** vgpu skill and docs, including the 3D scene guide.
2. Also search the web for community-made vgpu and WebGPU shader effects (GitHub, X, Vercel posts, other galleries). Quality and polish matter more than novelty.
3. List 8 to 10 candidates: link, what it looks like (screenshot or capture), GPU cost, license, and which section it could serve.
4. Choose **at most one** hero effect and **at most one** secondary use. It must relate to the product (sound, voice, light, signal becoming text) and **support** the hand-drawn illustrated hero, not compete with it. **Recommending no shader is acceptable and often better.**
5. Rules:
   - Use the gallery effect as published. Change only parameters and colors. No new shader code.
   - Detect WebGPU support and fall back to an intentional static image, not a blank area. SSR-safe, honor `prefers-reduced-motion`, pause off-screen, cap DPR, disable or simplify on mobile.
   - Must not reduce text contrast or push the headline or CTA below the fold.
6. Add a "why this one, not the others" paragraph.

**GATE C:** I approve the shader choice (or no shader). Update STATE.md and the ledger. Then stop.
