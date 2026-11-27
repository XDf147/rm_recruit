"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { TouchEvent } from "react";
import { gallery, robots } from "./content";
import { MediaLightbox } from "./MediaLightbox";

const albums = [
  { name: "战队现场", photos: gallery.map((photo) => ({ ...photo, cutout: false })) },
  { name: "RM 2023", photos: robots.map((robot) => ({ src: robot.image, title: robot.name, cutout: true })) },
];
const number = (n: number) => String(n + 1).padStart(2,"0");

export function MediaGallery({ active }: { active: boolean }) {
  const [album, setAlbum] = useState(0);
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [fullIndex, setFullIndex] = useState<number | null>(null);
  const menu = useRef<HTMLDivElement>(null);
  const thumbs = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const photos = albums[album].photos;
  const photo = photos[index];
  const count = photos.length;
  function chooseAlbum(n: number) { setAlbum(n); setIndex(0); setExpanded(false); }
  function move(delta: number) {
    if (fullIndex !== null) setFullIndex((n) => ((n ?? 0) + delta + count) % count);
    else setIndex((n) => Math.max(0,Math.min(count - 1,n + delta)));
  }
  useEffect(() => {
    if (!active) return;
    function key(event: KeyboardEvent) {
      if (event.altKey || event.metaKey || event.ctrlKey || event.defaultPrevented) return;
      if (expanded && event.key === "Escape") { event.preventDefault(); setExpanded(false); return; }
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      if (fullIndex === null && document.querySelector("dialog[open]")) return;
      event.preventDefault();
      const d = event.key === "ArrowLeft" ? -1 : 1;
      if (fullIndex !== null) setFullIndex((n) => ((n ?? 0) + d + count) % count);
      else setIndex((n) => Math.max(0,Math.min(count - 1,n + d)));
    }
    window.addEventListener("keydown", key, true);
    return () => window.removeEventListener("keydown", key, true);
  }, [active, fullIndex, expanded, count]);
  useEffect(() => {
    if (!expanded) return;
    function outside(e: PointerEvent) { if (!menu.current?.contains(e.target as Node)) setExpanded(false); }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [expanded]);
  useEffect(() => {
    const strip = thumbs.current;
    const selected = strip?.children[index];
    if (!active || !strip || !(selected instanceof HTMLElement) || strip.scrollWidth <= strip.clientWidth) return;
    const left = selected.offsetLeft, right = left + selected.offsetWidth;
    if (left < strip.scrollLeft || right > strip.scrollLeft + strip.clientWidth) {
      strip.scrollTo({ left: left < strip.scrollLeft ? left : right - strip.clientWidth, behavior: matchMedia("(prefers-reduced-motion:reduce)").matches ? "instant" : "smooth" });
    }
  }, [active, album, index]);

  const swipe = {
    onTouchStart(e: TouchEvent) { swiped.current = false; touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; },
    onTouchEnd(e: TouchEvent) {
      if (!touch.current) return;
      const dx = e.changedTouches[0].clientX - touch.current.x;
      const dy = e.changedTouches[0].clientY - touch.current.y;
      if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy)) { swiped.current = true; move(dx < 0 ? 1 : -1); }
      touch.current = null;
    },
  };
  return <>
    <button className="gallery-full" type="button" aria-label={"放大查看" + photo.title} onClick={(e) => {
      if (!swiped.current || !e.detail) setFullIndex(index);
      swiped.current = false;
    }} {...swipe}>
      <Image key={photo.src} src={photo.src} alt={photo.title} data-cutout={photo.cutout} fill sizes="(orientation:portrait) 70vw, 100vw" />
    </button>
    <div className="media-timeline">
      <small>COLLECTION</small>
      <div className="album-select" ref={menu}>
        <button className="album-step" type="button" aria-label="上一本图册" disabled={album === 0} onClick={() => chooseAlbum(album - 1)}>‹</button>
        <button className="album-current" type="button" aria-label="选择图册" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{albums[album].name}<i>‹</i></button>
        <button className="album-step" type="button" aria-label="下一本图册" disabled={album === albums.length - 1} onClick={() => chooseAlbum(album + 1)}>›</button>
        {expanded && <div className="album-options">{albums.map((a,n) => <button type="button" key={a.name} aria-pressed={album === n} onClick={() => chooseAlbum(n)}>{a.name}</button>)}</div>}
      </div>
      <div className="gallery-index">{photos.map((g,n) => <button key={g.src} type="button" aria-label={"查看" + g.title} aria-pressed={n === index}
        onTouchStart={swipe.onTouchStart} onTouchEnd={(event) => {
          const end = event.changedTouches[0];
          if (touch.current && Math.hypot(end.clientX - touch.current.x, end.clientY - touch.current.y) < 8) setIndex(n);
          touch.current = null;
        }} onClick={() => setIndex(n)}>{number(n)}</button>)}</div>
    </div>
    <div className="media-gallery-controls"><h2 aria-live="polite">{photo.title}</h2><span className="gallery-count">{number(index)} / {String(count).padStart(2,"0")}</span>
      <div className="gallery-strip"><button type="button" aria-label="上一张照片" disabled={index === 0} onClick={() => move(-1)}>‹</button>
        <div className="gallery-thumbs" ref={thumbs}>{photos.map((g,n) => <button type="button" key={g.src} aria-label={g.title} aria-pressed={index === n} onClick={() => setIndex(n)}>
          <span className="gallery-thumb-picture"><Image src={g.src} alt="" fill sizes="(orientation:portrait) 32vw, 115px" /></span><span className="gallery-thumb-name">{g.title}</span>
        </button>)}</div>
        <button type="button" aria-label="下一张照片" disabled={index === count - 1} onClick={() => move(1)}>›</button>
      </div>
    </div>
    {active && fullIndex !== null && <MediaLightbox title={photos[fullIndex].title} onClose={() => setFullIndex(null)}>
      <div className="full-photo" {...swipe}><Image src={photos[fullIndex].src} alt={photos[fullIndex].title} fill sizes="100vw" /></div>
      <button type="button" className="lightbox-prev" aria-label="上一张大图" onClick={() => move(-1)}>‹</button>
      <button type="button" className="lightbox-next" aria-label="下一张大图" onClick={() => move(1)}>›</button>
      <div className="full-caption"><strong>{photos[fullIndex].title}</strong><small>{albums[album].name} {number(fullIndex)} / {String(count).padStart(2,"0")}</small></div>
    </MediaLightbox>}
  </>;
}
