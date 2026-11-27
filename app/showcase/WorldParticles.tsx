"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number; light: number };
const count = 3200;

// 用原图的透明轮廓和明暗边缘取点，让同一批粒子能在两个图案之间移动。
function sample(image: HTMLImageElement): Point[] {
  const canvas = document.createElement("canvas");
  const size = 180;
  canvas.width = canvas.height = size;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return [];
  const scale = (size - 8) / Math.max(image.naturalWidth, image.naturalHeight);
  const w = image.naturalWidth * scale, h = image.naturalHeight * scale;
  context.drawImage(image, (size - w) / 2, (size - h) / 2, w, h);
  const pixels = context.getImageData(0, 0, size, size).data;
  const light = (i: number) => (pixels[i] * .25 + pixels[i + 1] * .55 + pixels[i + 2] * .2) * pixels[i + 3] / 255;
  const points: Point[] = [];
  for (let y = 2; y < size - 2; y++) {
    for (let x = 2; x < size - 2; x++) {
      const i = (y * size + x) * 4;
      if (pixels[i + 3] < 65) continue;
      const value = light(i);
      const edge = Math.abs(value - light(i + 8)) + Math.abs(value - light(i + size * 8));
      const hash = ((x * 1973 ^ y * 9277) * 15731 >>> 0) % 256;
      if (edge + value * .2 < 15 || hash > Math.min(240, edge * 2.8 + value * .38)) continue;
      points.push({ x: x / size - .5, y: y / size - .5, light: Math.min(1, .27 + (value + edge) / 290) });
    }
  }
  if (!points.length) return [];
  return Array.from({ length: count }, (_, i) => points[(i * 7919) % points.length]);
}

export function WorldParticles({ src, active }: { src: string; active: boolean }) {
  const surface = useRef<HTMLCanvasElement>(null);
  const last = useRef<Point[]>([]);
  useEffect(() => {
    const canvas = surface.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !active) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const img = new window.Image();
    let disposed = false, frame = 0, width = 1, height = 1;
    let start = 0, lastDraw = -100;
    let target: Point[] = [], origin: Point[] = [];
    function draw(now: number) {
      if (disposed || !ctx || !target.length) return;
      const t = reduced.matches ? 1 : Math.min(1, (now - start) / 1150);
      const ease = t * t * (3 - 2 * t), burst = Math.sin(t * Math.PI);
      if (now - lastDraw > 30 || reduced.matches) {
        lastDraw = now;
        ctx.clearRect(0, 0, width, height);
        const side = Math.min(width, height) * .99;
        for (let i = 0; i < target.length; i++) {
          const a = origin[i], b = target[i];
          const p = last.current[i];
          p.x = a.x + (b.x - a.x) * ease + Math.sin(i * 1.47) * burst * .12;
          p.y = a.y + (b.y - a.y) * ease + Math.cos(i * .84) * burst * .11;
          const flicker = reduced.matches ? 1 : .80 + .20 * Math.sin(now / 670 + i);
          ctx.globalAlpha = b.light * flicker;
          const dot = (i % 9 === 0 ? 2 : 1.35) * Math.max(.88, side / 480);
          ctx.fillRect(width / 2 + p.x * side, height / 2 + p.y * side, dot, dot);
        }
      }
      if (!reduced.matches && !document.hidden) frame = requestAnimationFrame(draw);
    }
    function startDrawing() {
      cancelAnimationFrame(frame);
      if (!document.hidden) frame = requestAnimationFrame(draw);
    }
    function resize() {
      if (!canvas || !ctx) return;
      width = canvas.clientWidth; height = canvas.clientHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#e0e4e6";
      startDrawing();
    }
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    document.addEventListener("visibilitychange", startDrawing);
    reduced.addEventListener("change", startDrawing);
    img.onload = () => {
      if (disposed) return;
      target = sample(img);
      if (!target.length) return;
      origin = last.current.length === count ? last.current.map((p) => ({ ...p })) : target.map((p, i) => ({ ...p, x: p.x * .4 + .25 * Math.sin(i), y: p.y * .6 + .24 * Math.cos(i) }));
      last.current = origin.map((p) => ({ ...p }));
      start = performance.now(); resize();
    };
    img.src = src;
    return () => {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect();
      document.removeEventListener("visibilitychange", startDrawing); reduced.removeEventListener("change", startDrawing);
    };
  }, [src, active]);
  return <canvas className="world-particles" ref={surface} aria-hidden="true" />;
}
