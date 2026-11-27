"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

const vertex = `
  attribute vec2 point;
  uniform vec2 viewport, center;
  uniform mediump vec2 velocity;
  varying mediump vec2 uv;
  void main() {
    uv = point;
    vec2 bend = cos((point.yx - .5) * 1.570796) * velocity * 12.5;
    vec2 pixels = center + (point - .5) * 1000.0 + bend;
    gl_Position = vec4((pixels / viewport * 2.0 - 1.0) * vec2(1.,-1.), 0., 1.);
  }`;
const fragment = `
  precision mediump float;
  varying mediump vec2 uv;
  uniform vec2 velocity;
  uniform sampler2D art;
  void main() {
    vec2 shift = cos((uv.yx - .5) * 1.570796) * velocity * .000625;
    vec4 r = texture2D(art, uv + shift);
    vec4 g = texture2D(art, uv + 2.0 * shift);
    vec4 b = texture2D(art, uv + 3.0 * shift);
    gl_FragColor = vec4(r.r * r.a, g.g * g.a, b.b * b.a, min(1., r.a + g.a + b.a));
  }`;

function makeRenderer(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false });
  if (!gl) return null;
  const program = gl.createProgram()!;
  for (const [type, source] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]] as const) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source); gl.compileShader(shader);
    gl.attachShader(program, shader); gl.deleteShader(shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { gl.deleteProgram(program); return null; }
  gl.useProgram(program);
  const grid: number[] = [];
  const divisions = 24;
  for (let y = 0; y < divisions; y++) for (let x = 0; x < divisions; x++) {
    const l = x / divisions, r = (x + 1) / divisions, t = y / divisions, b = (y + 1) / divisions;
    grid.push(l,t, r,t, l,b, l,b, r,t, r,b);
  }
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(grid), gl.STATIC_DRAW);
  const pos = gl.getAttribLocation(program, "point");
  gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  for (const axis of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T]) gl.texParameteri(gl.TEXTURE_2D, axis, gl.CLAMP_TO_EDGE);
  for (const filter of [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER]) gl.texParameteri(gl.TEXTURE_2D, filter, gl.LINEAR);
  const viewport = gl.getUniformLocation(program, "viewport"), center = gl.getUniformLocation(program, "center"), speed = gl.getUniformLocation(program, "velocity");
  let uploaded: HTMLImageElement | null = null;
  return {
    paint(image: HTMLImageElement, x: number, y: number, vx: number, vy: number) {
      const width = canvas.clientWidth, height = canvas.clientHeight;
      const pixelRatio = Math.min(window.devicePixelRatio, 2);
      if (canvas.width !== Math.round(width * pixelRatio) || canvas.height !== Math.round(height * pixelRatio)) {
        canvas.width = Math.round(width * pixelRatio); canvas.height = Math.round(height * pixelRatio);
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      if (uploaded !== image) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        uploaded = image;
      }
      gl.uniform2f(viewport, width, height); gl.uniform2f(center, x, y); gl.uniform2f(speed, vx, vy);
      gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, grid.length / 2);
    },
    dispose() { gl.deleteTexture(texture); gl.deleteBuffer(buffer); gl.deleteProgram(program); },
  };
}

export function WorldHover({ menu, active }: { menu: RefObject<HTMLDivElement | null>; active: boolean }) {
  const surface = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = surface.current, list = menu.current;
    if (!active || !canvas || !list) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const images = new Map<string, HTMLImageElement>();
    let renderer: ReturnType<typeof makeRenderer> | undefined;
    let selected: HTMLImageElement | null = null;
    let x = 0, y = 0, targetX = 0, targetY = 0, frame = 0, previousTime = 0;
    function schedule() { if (!frame && selected) frame = requestAnimationFrame(draw); }
    function draw(time: number) {
      frame = 0;
      if (!canvas || !selected?.complete || !selected.naturalWidth) return;
      const dt = Math.min(3, Math.max(.25, (time - previousTime) / (1000 / 60)));
      previousTime = time;
      const dx = targetX - x, dy = targetY - y;
      const follow = reduced.matches ? 1 : 1 - Math.pow(23 / 24, dt);
      const vx = Math.abs(dx) < .72 ? 0 : dx * follow, vy = Math.abs(dy) < .72 ? 0 : dy * follow;
      x = vx ? x + vx : targetX; y = vy ? y + vy : targetY;
      canvas.hidden = false;
      if (renderer === undefined) renderer = makeRenderer(canvas);
      if (renderer) renderer.paint(selected, x, y, reduced.matches ? 0 : vx / dt, reduced.matches ? 0 : vy / dt);
      else {
        canvas.style.backgroundImage = `url("${selected.src}")`;
        canvas.style.backgroundPosition = `${x - 500}px ${y - 500}px`;
      }
      if (!reduced.matches && (vx || vy)) schedule();
    }
    for (const row of list.querySelectorAll<HTMLElement>("[data-hover-art]")) {
      const src = row.dataset.hoverArt!;
      const image = new Image();
      image.onload = () => { if (image === selected) schedule(); };
      image.src = src; images.set(src, image);
    }
    function preview(row: HTMLElement, clientX: number, clientY: number) {
      if (!canvas) return;
      const rect = canvas.parentElement!.getBoundingClientRect();
      targetX = clientX - rect.left; targetY = clientY - rect.top;
      if (!selected) { x = targetX; y = targetY; previousTime = performance.now(); }
      selected = images.get(row.dataset.hoverArt!) ?? null;
      schedule();
    }
    function pointer(e: PointerEvent) {
      if (e.pointerType === "touch") return;
      const row = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-hover-art]") : null;
      if (row) preview(row, e.clientX, e.clientY);
    }
    function focus(e: FocusEvent) {
      if (!(e.target instanceof HTMLElement) || !e.target.matches("[data-hover-art]:focus-visible")) return;
      const rect = e.target.getBoundingClientRect();
      preview(e.target, rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
    function hide() { selected = null; cancelAnimationFrame(frame); frame = 0; if (canvas) canvas.hidden = true; }
    list.addEventListener("pointerover", pointer); list.addEventListener("pointermove", pointer);
    list.addEventListener("pointerleave", hide); list.addEventListener("focusin", focus); list.addEventListener("focusout", hide);
    return () => {
      hide(); images.forEach((i) => { i.onload = null; }); renderer?.dispose();
      canvas.style.removeProperty("background-image"); canvas.style.removeProperty("background-position");
      list.removeEventListener("pointerover", pointer); list.removeEventListener("pointermove", pointer);
      list.removeEventListener("pointerleave", hide); list.removeEventListener("focusin", focus); list.removeEventListener("focusout", hide);
    };
  }, [menu, active]);
  return <canvas ref={surface} className="world-hover-art" hidden aria-hidden="true" />;
}
