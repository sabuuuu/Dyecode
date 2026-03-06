"use client";

import { useEffect, useMemo, useRef } from "react";
import chroma from "chroma-js";
import { cn } from "@/lib/utils";

type Strand = {
  x: number;
  wobble: number;
  cp1: number;
  cp2: number;
  width: number;
  alpha: number;
  lightnessShift: number;
};

type HairPreviewCanvasProps = {
  hex: string;
  className?: string;
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function HairPreviewCanvas({ hex, className }: HairPreviewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const currentHexRef = useRef<string>(hex);
  const strandsRef = useRef<Strand[]>([]);

  const seed = useMemo(() => {
    const normalized = hex.replace("#", "");
    const seedInt = Number.parseInt(normalized.slice(0, 6), 16);
    return Number.isFinite(seedInt) ? seedInt : 123456;
  }, [hex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const nextW = Math.max(1, Math.floor(rect.width * dpr));
      const nextH = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width === nextW && canvas.height === nextH) return;
      canvas.width = nextW;
      canvas.height = nextH;
      strandsRef.current = makeStrands(nextW, nextH, seed);
      draw(ctx, nextW, nextH, currentHexRef.current, strandsRef.current);
    };

    const ro = new ResizeObserver(() => resize());
    ro.observe(container);
    resize();

    return () => {
      ro.disconnect();
    };
  }, [seed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fromHex = currentHexRef.current;
    const toHex = hex;
    if (fromHex === toHex) return;

    const start = performance.now();
    const durationMs = 320;

    const tick = (now: number) => {
      const t = clamp01((now - start) / durationMs);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // easeInOutQuad

      const mixed = chroma.mix(fromHex, toHex, eased, "lab").hex();
      currentHexRef.current = mixed;

      draw(ctx, canvas.width, canvas.height, mixed, strandsRef.current);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        currentHexRef.current = toHex;
        rafRef.current = null;
      }
    };

    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [hex]);

  return (
    <div ref={containerRef} className={cn("relative w-full h-full", className)}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
}

function makeStrands(w: number, h: number, seed: number): Strand[] {
  const rand = mulberry32(seed ^ (w * 31 + h * 17));
  const count = Math.max(42, Math.floor(w / 12));
  const strands: Strand[] = [];

  for (let i = 0; i < count; i++) {
    const x = (i + rand() * 0.6) * (w / count);
    strands.push({
      x,
      wobble: lerp(0.6, 2.6, rand()),
      cp1: lerp(0.18, 0.42, rand()),
      cp2: lerp(0.58, 0.88, rand()),
      width: lerp(0.9, 2.4, rand()),
      alpha: lerp(0.05, 0.14, rand()),
      lightnessShift: lerp(-0.35, 0.35, rand()),
    });
  }

  return strands;
}

function draw(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  hex: string,
  strands: Strand[],
) {
  ctx.clearRect(0, 0, w, h);

  const base = chroma(hex);
  const rootHex = base.darken(0.55).hex();
  const midHex = base.hex();
  const endsHex = base.brighten(0.35).hex();

  // Hair silhouette (clip) - soft "hair mass" blob
  const radius = Math.min(w, h) * 0.18;
  ctx.save();
  roundedRect(ctx, 0, 0, w, h, radius);
  ctx.clip();

  // Base depth gradient (roots -> ends)
  const vertical = ctx.createLinearGradient(0, 0, 0, h);
  vertical.addColorStop(0.0, rootHex);
  vertical.addColorStop(0.55, midHex);
  vertical.addColorStop(1.0, endsHex);
  ctx.fillStyle = vertical;
  ctx.fillRect(0, 0, w, h);

  // Strand strokes
  for (const s of strands) {
    const strandColor = chroma(hex)
      .set("hsl.l", clamp01(chroma(hex).hsl()[2] + s.lightnessShift * 0.08))
      .hex();

    ctx.strokeStyle = chroma(strandColor).alpha(s.alpha).css();
    ctx.lineWidth = s.width;
    ctx.lineCap = "round";

    const startY = -h * 0.05;
    const endY = h * 1.05;
    const x0 = s.x + (Math.sin(s.x * 0.02) * s.wobble);
    const x1 = s.x + (Math.cos(s.x * 0.018) * s.wobble);
    const cp1x = x0 + Math.sin(s.x * 0.01) * (w * 0.04);
    const cp2x = x1 + Math.cos(s.x * 0.013) * (w * 0.05);
    const cp1y = h * s.cp1;
    const cp2y = h * s.cp2;

    ctx.beginPath();
    ctx.moveTo(x0, startY);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x1, endY);
    ctx.stroke();
  }

  // Subtle specular band (shine)
  const shine = ctx.createLinearGradient(w * 0.25, 0, w * 0.75, 0);
  shine.addColorStop(0.0, "rgba(255,255,255,0)");
  shine.addColorStop(0.45, "rgba(255,255,255,0.10)");
  shine.addColorStop(0.55, "rgba(255,255,255,0.08)");
  shine.addColorStop(1.0, "rgba(255,255,255,0)");
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = shine;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "source-over";

  // Micro-texture (very subtle grain)
  const grainCount = Math.floor((w * h) / 1800);
  ctx.fillStyle = "rgba(0,0,0,0.03)";
  for (let i = 0; i < grainCount; i++) {
    const x = (i * 97) % w;
    const y = (i * 57) % h;
    ctx.fillRect(x, y, 1, 1);
  }

  ctx.restore();

  // Outer edge shading to add depth
  ctx.save();
  roundedRect(ctx, 0, 0, w, h, radius);
  ctx.clip();
  const vignette = ctx.createRadialGradient(
    w * 0.5,
    h * 0.45,
    Math.min(w, h) * 0.1,
    w * 0.5,
    h * 0.55,
    Math.max(w, h) * 0.75,
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.22)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.max(0, Math.min(r, Math.min(w, h) / 2));
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}

