"use client";

import { useEffect, useRef } from "react";

/**
 * Persistent site-wide backdrop, replacing the earlier version that was
 * too subtle to read in real use. This is an ORIGINAL voxel-inspired
 * world illustration -- not a Minecraft screenshot or game asset -- built
 * from layered blocky silhouettes and glow, deliberately multi-color
 * (deep blue night, warm orange horizon, cool green + gold glow, white
 * highlight edges) so the site doesn't read as monochrome once you scroll
 * past the hero.
 *
 * Layers, back to front:
 *  1. CSS gradient sky wash (painted in the parent wrapper, see below)
 *  2. Distant blocky mountain silhouette (blue-gray, low contrast)
 *  3. Mid blocky ridge silhouette (deeper, warmer)
 *  4. Floating voxel "islands" with colored glow -- the creative signature
 *     element unique to this backdrop, echoing the hero's diamond-core
 *     motif without repeating it
 *  5. Sparse stars + drifting dust particles
 *
 * Everything here is `position: fixed`, so it does not scroll with the
 * page -- it acts as a constant backdrop plate visible through any
 * section that doesn't paint its own opaque background.
 */
export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.7,
      r: Math.random() * 1.1 + 0.3,
      phase: Math.random() * Math.PI * 2,
    }));

    const dust = Array.from({ length: 26 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.6,
      speed: Math.random() * 0.15 + 0.05,
      phase: Math.random() * Math.PI * 2,
    }));

    // Floating voxel islands: small isometric cube clusters with colored
    // glow, scattered at fixed screen-relative positions.
    const islands = [
      { x: 0.08, y: 0.18, size: 22, color: "0,230,118", glow: 70 },
      { x: 0.9, y: 0.32, size: 16, color: "79,195,247", glow: 60 },
      { x: 0.78, y: 0.72, size: 18, color: "255,112,67", glow: 65 },
      { x: 0.15, y: 0.62, size: 14, color: "255,193,7", glow: 55 },
    ];

    function drawVoxelCube(cx: number, cy: number, s: number, rgb: string) {
      ctx!.save();
      ctx!.translate(cx, cy);
      // top face
      ctx!.beginPath();
      ctx!.moveTo(0, -s);
      ctx!.lineTo(s * 0.87, -s * 0.5);
      ctx!.lineTo(0, 0);
      ctx!.lineTo(-s * 0.87, -s * 0.5);
      ctx!.closePath();
      ctx!.fillStyle = `rgba(${rgb},0.5)`;
      ctx!.fill();
      // left face
      ctx!.beginPath();
      ctx!.moveTo(-s * 0.87, -s * 0.5);
      ctx!.lineTo(0, 0);
      ctx!.lineTo(0, s);
      ctx!.lineTo(-s * 0.87, s * 0.5);
      ctx!.closePath();
      ctx!.fillStyle = `rgba(${rgb},0.32)`;
      ctx!.fill();
      // right face
      ctx!.beginPath();
      ctx!.moveTo(s * 0.87, -s * 0.5);
      ctx!.lineTo(0, 0);
      ctx!.lineTo(0, s);
      ctx!.lineTo(s * 0.87, s * 0.5);
      ctx!.closePath();
      ctx!.fillStyle = `rgba(${rgb},0.22)`;
      ctx!.fill();
      ctx!.restore();
    }

    function drawMountainSilhouette(
      baseY: number,
      amplitude: number,
      seed: number,
      fill: string,
      blockSize: number
    ) {
      // Stepped/blocky profile (voxel terrain) instead of a smooth curve --
      // this is what makes it read as "Minecraft" rather than generic hills.
      ctx!.beginPath();
      ctx!.moveTo(0, height);
      const steps = Math.ceil(width / blockSize) + 1;
      for (let i = 0; i <= steps; i++) {
        const x = i * blockSize;
        const noise =
          Math.sin(i * 0.5 + seed) * amplitude +
          Math.sin(i * 0.18 + seed * 2) * amplitude * 0.6;
        const y =
          Math.round((baseY - noise) / blockSize) * blockSize;
        ctx!.lineTo(x, y);
        ctx!.lineTo(x + blockSize, y);
      }
      ctx!.lineTo(width, height);
      ctx!.closePath();
      ctx!.fillStyle = fill;
      ctx!.fill();
    }

    let raf = 0;

    function frame(now: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Distant blocky ridge (cool blue, low presence)
      drawMountainSilhouette(height * 0.72, 46, 1.2, "rgba(79,120,160,0.12)", 34);
      // Mid blocky ridge (warmer, slightly stronger)
      drawMountainSilhouette(height * 0.82, 34, 3.4, "rgba(20,26,36,0.55)", 26);

      // Floating voxel islands with glow
      for (const island of islands) {
        const t = prefersReducedMotion ? 0 : now * 0.00015;
        const bob = Math.sin(t + island.x * 10) * 6;
        const ix = island.x * width;
        const iy = island.y * height + bob;
        const glow = ctx.createRadialGradient(ix, iy, 0, ix, iy, island.glow);
        glow.addColorStop(0, `rgba(${island.color},0.16)`);
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(ix, iy, island.glow, 0, Math.PI * 2);
        ctx.fill();
        drawVoxelCube(ix, iy, island.size, island.color);
      }

      // Dust / floating particles
      for (const p of dust) {
        const t = prefersReducedMotion ? 0 : now * 0.00006 * p.speed;
        const px = (p.x + Math.sin(t + p.phase) * 0.02) * width;
        const py = (p.y + Math.cos(t * 0.7 + p.phase) * 0.02) * height;
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Stars
      for (const s of stars) {
        const tw = prefersReducedMotion
          ? 0.7
          : 0.5 + 0.5 * Math.sin(now * 0.0006 + s.phase);
        ctx.fillStyle = `rgba(255,255,255,${0.35 * tw})`;
        ctx.beginPath();
        ctx.arc(s.x * width, s.y * height, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 h-full w-full" aria-hidden="true">
      {/* Static gradient sky wash -- gives the whole site a consistent
          dusk-to-night color story instead of flat black between sections */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0b0f14 0%, #0d1420 30%, #131a2a 55%, #1a1420 78%, #0b0f14 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[45%] opacity-60"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(255,112,67,0.05) 40%, rgba(11,15,20,0) 100%)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
