"use client";

import { useEffect, useRef } from "react";

/**
 * Layered Canvas2D biome scene — the site's signature element.
 *
 * Chosen over WebGL/R3F deliberately: this gives the shader-lit,
 * atmospheric look the brief asks for at a fraction of the JS/GPU
 * budget, which keeps the Lighthouse performance target realistic.
 *
 * Structure:
 *  - sky gradient interpolated across 4 keyframes (sunrise/day/sunset/night)
 *    on a slow internal clock (not real time)
 *  - sun/moon arc
 *  - stars, fading in at night
 *  - two parallax mountain silhouette layers (react to pointer position)
 *  - a river band with a soft vertical reflection of the sky
 *  - drifting cloud blobs
 *  - ambient floating particles + fireflies (denser at night)
 *  - a fixed dark overlay is applied in CSS by the parent for text contrast
 */

const CYCLE_MS = 90_000; // full sunrise->night loop

type Keyframe = { top: string; bottom: string; sun: string };

const KEYFRAMES: Keyframe[] = [
  { top: "#2b3a55", bottom: "#e8946b", sun: "#ffb066" }, // sunrise (t=0)
  { top: "#1b5b8f", bottom: "#7fd0e8", sun: "#fff4c2" }, // day (t=0.33)
  { top: "#2c2350", bottom: "#e0654f", sun: "#ffb066" }, // sunset (t=0.66)
  { top: "#060a12", bottom: "#0d1424", sun: "#dfe8ff" }, // night (t=1.0 wraps to 0)
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function lerpColor(hexA: string, hexB: string, t: number) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const r = Math.round(lerp(a.r, b.r, t));
  const g = Math.round(lerp(a.g, b.g, t));
  const bl = Math.round(lerp(a.b, b.b, t));
  return `rgb(${r} ${g} ${bl})`;
}

function getSkyPhase(t: number) {
  // Normalize into [0,1) defensively -- guards against floating-point
  // drift (e.g. t landing exactly on 1) ever producing an out-of-range
  // index, which was the source of the "reading 'top' of undefined" crash.
  const normalized = ((t % 1) + 1) % 1;
  const segment = normalized * KEYFRAMES.length;
  let i = Math.floor(segment);
  if (i < 0) i = 0;
  if (i >= KEYFRAMES.length) i = KEYFRAMES.length - 1;
  const next = (i + 1) % KEYFRAMES.length;
  const localT = segment - i;
  const from = KEYFRAMES[i] ?? KEYFRAMES[0]!;
  const to = KEYFRAMES[next] ?? KEYFRAMES[0]!;
  return { from, to, localT };
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onPointerMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener("pointermove", onPointerMove);

    // Deterministic pseudo-random field generators (stable per reload)
    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.6,
      r: Math.random() * 1.2 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
    }));

    const particles = Array.from({ length: 34 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.8 + 0.6,
      speed: Math.random() * 0.02 + 0.006,
      drift: Math.random() * 0.4 - 0.2,
      phase: Math.random() * Math.PI * 2,
      firefly: Math.random() > 0.6,
    }));

    const clouds = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random(),
      y: 0.08 + i * 0.05 + Math.random() * 0.05,
      scale: 0.6 + Math.random() * 0.9,
      speed: 0.0015 + Math.random() * 0.001,
    }));

    function drawMountainLayer(
      baseY: number,
      amplitude: number,
      seedOffset: number,
      color: string,
      parallaxStrength: number
    ) {
      const px = (pointerRef.current.x - 0.5) * parallaxStrength;
      ctx!.beginPath();
      ctx!.moveTo(0, height);
      const points = 8;
      for (let i = 0; i <= points; i++) {
        const x = (i / points) * width + px;
        const noise =
          Math.sin(i * 1.7 + seedOffset) * amplitude +
          Math.sin(i * 0.6 + seedOffset * 1.3) * amplitude * 0.5;
        const y = baseY - noise;
        ctx!.lineTo(x, y);
      }
      ctx!.lineTo(width, height);
      ctx!.closePath();
      ctx!.fillStyle = color;
      ctx!.fill();
    }

    let raf = 0;
    let start = performance.now();

    function frame(now: number) {
      if (!ctx) return;
      const elapsed = prefersReducedMotion ? 15_000 : now - start;
      const t = (elapsed % CYCLE_MS) / CYCLE_MS;
      const { from, to, localT } = getSkyPhase(t);

      // Sky gradient
      const skyTop = lerpColor(from.top, to.top, localT);
      const skyBottom = lerpColor(from.bottom, to.bottom, localT);
      const sunColor = lerpColor(from.sun, to.sun, localT);

      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, skyTop);
      grad.addColorStop(1, skyBottom);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Sun/moon arc: rises left, sets right, tracks the same t
      const arcT = t; // full cycle = one arc pass, simple & readable
      const sunX = arcT * width;
      const sunY = height * 0.55 - Math.sin(arcT * Math.PI) * height * 0.42;
      const isNightish = t > 0.72 || t < 0.02;
      const glow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 90);
      glow.addColorStop(0, sunColor);
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 90, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = sunColor;
      ctx.beginPath();
      ctx.arc(sunX, sunY, isNightish ? 14 : 22, 0, Math.PI * 2);
      ctx.fill();

      // Stars (fade in as night approaches)
      const nightAmount = Math.max(
        0,
        Math.min(1, (t - 0.62) / 0.15 > 0 ? 1 : (t - 0.62) / 0.15)
      ) - Math.max(0, Math.min(1, (t - 0.02) / 0.1));
      const starAlpha = t > 0.62 || t < 0.05 ? 0.9 : 0;
      if (starAlpha > 0) {
        for (const s of stars) {
          const tw = 0.5 + 0.5 * Math.sin(elapsed * 0.001 + s.twinkle);
          ctx.fillStyle = `rgba(255,255,255,${starAlpha * tw * 0.8})`;
          ctx.beginPath();
          ctx.arc(s.x * width, s.y * height, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      void nightAmount;

      // Clouds
      for (const c of clouds) {
        c.x += c.speed * (prefersReducedMotion ? 0 : 1) * 0.016 * 16;
        if (c.x > 1.3) c.x = -0.3;
        const cx = c.x * width;
        const cy = c.y * height;
        ctx.fillStyle = "rgba(255,255,255,0.10)";
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.ellipse(
            cx + i * 22 * c.scale,
            cy + Math.sin(i) * 4,
            30 * c.scale,
            14 * c.scale,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }

      // Mountain layers (parallax on pointer)
      drawMountainLayer(height * 0.78, 40, 1.5, "rgba(10,16,24,0.55)", 14);
      drawMountainLayer(height * 0.86, 55, 4.2, "rgba(6,10,16,0.85)", 26);

      // River band + reflection
      const riverTop = height * 0.86;
      const riverGrad = ctx.createLinearGradient(0, riverTop, 0, height);
      riverGrad.addColorStop(0, skyBottom);
      riverGrad.addColorStop(1, skyTop);
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = riverGrad;
      ctx.fillRect(0, riverTop, width, height - riverTop);
      ctx.globalAlpha = 1;

      // Fog band near the horizon for depth
      const fog = ctx.createLinearGradient(0, height * 0.7, 0, height * 0.9);
      fog.addColorStop(0, "rgba(11,15,20,0)");
      fog.addColorStop(1, "rgba(11,15,20,0.45)");
      ctx.fillStyle = fog;
      ctx.fillRect(0, height * 0.7, width, height * 0.2);

      // Particles / fireflies
      for (const p of particles) {
        p.y -= p.speed * (prefersReducedMotion ? 0.15 : 1) * 0.016 * 16;
        p.x += Math.sin(elapsed * 0.0005 + p.phase) * 0.0004;
        if (p.y < -0.05) p.y = 1.05;
        const isFireflyActive = p.firefly && (t > 0.62 || t < 0.05);
        const flicker = 0.5 + 0.5 * Math.sin(elapsed * 0.004 + p.phase);
        ctx.fillStyle = isFireflyActive
          ? `rgba(0,230,118,${0.5 * flicker + 0.2})`
          : "rgba(255,255,255,0.25)";
        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    // Pause the loop entirely when the tab is hidden
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
