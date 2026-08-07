"use client";

import { useEffect, useRef } from "react";

/**
 * Persistent site-wide backdrop. Distinct from HeroCanvas (which owns the
 * full day/night cinematic scene) -- this is a much cheaper, quieter layer
 * that sits behind every section below the fold so the "world" the hero
 * establishes doesn't just vanish once you scroll past it.
 *
 * Visual language, deliberately abstract rather than literal blocks:
 *  - a faint isometric grid reminiscent of chunk/terrain boundaries
 *  - soft drifting accent-colored glow blobs (biome light shafts)
 *  - a sparse starfield that stays constant (no day/night cycle here --
 *    that story is told once, in the hero)
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

    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1 + 0.3,
      phase: Math.random() * Math.PI * 2,
    }));

    const blobs = [
      { color: "0,230,118", x: 0.15, y: 0.2, r: 380, speed: 0.00012, phase: 0 },
      { color: "79,195,247", x: 0.85, y: 0.55, r: 420, speed: 0.00009, phase: 2 },
      { color: "255,193,7", x: 0.4, y: 0.85, r: 320, speed: 0.0001, phase: 4 },
    ];

    let raf = 0;

    function drawGrid() {
      const spacing = 64;
      ctx!.strokeStyle = "rgba(255,255,255,0.025)";
      ctx!.lineWidth = 1;
      for (let x = 0; x < width; x += spacing) {
        ctx!.beginPath();
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, height);
        ctx!.stroke();
      }
      for (let y = 0; y < height; y += spacing) {
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(width, y);
        ctx!.stroke();
      }
    }

    function frame(now: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      drawGrid();

      for (const b of blobs) {
        const t = prefersReducedMotion ? 0 : now * b.speed + b.phase;
        const bx = (b.x + Math.sin(t) * 0.03) * width;
        const by = (b.y + Math.cos(t * 0.8) * 0.03) * height;
        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, b.r);
        grad.addColorStop(0, `rgba(${b.color},0.05)`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(bx, by, b.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const s of stars) {
        const tw = prefersReducedMotion
          ? 0.7
          : 0.5 + 0.5 * Math.sin(now * 0.0006 + s.phase);
        ctx.fillStyle = `rgba(255,255,255,${0.25 * tw})`;
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
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-90"
    />
  );
}
