"use client";
import { useEffect, useRef, useState } from "react";
import type { FrameLoopHandle, init as Init } from "vgpu";
import shader from "@/app/ripple.wgsl";

// Same vgpu artwork in both paths: live interactive WebGPU, or a rendered loop.
export function Ambient({ playing = true }: { playing?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playRef = useRef(playing);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const m = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    playRef.current = playing && !reduced;
    const video = videoRef.current;
    if (!video) return;
    let visible = true;
    const update = () => {
      if (playing && !reduced && !ready && visible && !document.hidden)
        void video.play().catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(video);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      video.pause();
    };
  }, [playing, reduced, ready]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (reduced || !("gpu" in navigator)) {
      canvas.dataset.renderState = reduced ? "poster" : "video";
      return;
    }
    let disposed = false,
      gpu: Awaited<ReturnType<typeof Init>> | undefined,
      loop: FrameLoopHandle | undefined;
    let resizeOff: (() => void) | undefined, errorOff: (() => void) | undefined;
    let visible = true,
      time = videoRef.current?.currentTime ?? 0,
      previous = 0,
      dirty = true;
    let pointer: [number, number] = [0.5, 0.5],
      targetPointer: [number, number] = [0.5, 0.5];
    const move = (e: PointerEvent) => {
      if (!playRef.current) return;
      const r = canvas.getBoundingClientRect();
      targetPointer = [
        Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
        Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)),
      ];
    };
    const fallback = (reason: unknown) => {
      if (disposed) return;
      canvas.dataset.renderState = "video";
      canvas.dataset.fallbackReason = String(reason);
      setReady(false);
      loop?.stop();
    };
    const observer = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      previous = 0;
    });
    observer.observe(canvas);
    void (async () => {
      try {
        const { init, surface, effect, frameLoop } = await import("vgpu");
        if (disposed) return;
        gpu = await init({ powerPreference: "low-power" });
        if (disposed) {
          gpu.dispose();
          return;
        }
        errorOff = gpu.onError(fallback);
        const target = surface(gpu, canvas, { dpr: [1, 1.25] });
        const paint = effect(gpu, shader, {
          set: {
            params: { time, aspect: target.size[0] / target.size[1], pointer },
          },
        });
        resizeOff = target.onResize(({ width, height }) => {
          dirty = true;
          paint.set({ params: { aspect: width / Math.max(height, 1) } });
        });
        await paint.compile(target);
        if (disposed) return;
        window.addEventListener("pointermove", move, { passive: true });
        loop = frameLoop(
          gpu,
          (frame) => {
            const now = performance.now(),
              dt = previous ? Math.min((now - previous) / 1000, 0.1) : 0;
            previous = now;
            if (!visible || document.hidden) return;
            if (!playRef.current && !dirty) return;
            if (playRef.current) {
              time += dt;
              pointer = [
                pointer[0] + (targetPointer[0] - pointer[0]) * 0.065,
                pointer[1] + (targetPointer[1] - pointer[1]) * 0.065,
              ];
            }
            try {
              paint.set({ params: { time, pointer } });
              frame.pass(target, paint);
              dirty = false;
              if (canvas.dataset.renderState !== "webgpu") {
                canvas.dataset.renderState = "webgpu";
                setReady(true);
              }
            } catch (e) {
              fallback(e);
            }
          },
          { fps: 30 },
        );
      } catch (e) {
        fallback(e);
        gpu?.dispose();
      }
    })();
    return () => {
      disposed = true;
      window.removeEventListener("pointermove", move);
      observer.disconnect();
      resizeOff?.();
      errorOff?.();
      loop?.stop();
      gpu?.dispose();
      setReady(false);
    };
  }, [reduced]);
  // Video is lazy-mounted after motion preferences resolve; no unwanted autoplay.
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-sky [mask-image:linear-gradient(to_right,transparent,#000_4%,#000_96%,transparent),linear-gradient(to_bottom,transparent,#000_4%,#000_96%,transparent)] [mask-composite:intersect]">
      <img
        src="/light-field.webp"
        alt=""
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover"
      />
      {!reduced && (
        <video
          ref={videoRef}
          src="/glass-loop.mp4"
          poster="/light-field.webp"
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 size-full object-cover"
        />
      )}
      <canvas
        ref={canvasRef}
        data-render-state="loading"
        className={`absolute inset-0 size-full transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
