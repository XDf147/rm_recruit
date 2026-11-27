"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { chapters, type ChapterId } from "./content";
import { EntryLoader } from "./EntryLoader";

type Frame = { current: ChapterId; previous: ChapterId | null };
const first: Frame = { current: "index", previous: null };
const DeckContext = createContext({ ...first, interactive: true });
export const useShowcase = () => useContext(DeckContext);

const aliases: Record<string, ChapterId> = {
  top: "index", events: "information", robots: "operator", groups: "world", contact: "more", honors: "more",
};
const ids: ChapterId[] = chapters.map(({ id }) => id);
function chapterAt(hash: string) {
  const id = hash.slice(1);
  return id === "site-footer" ? "more" : aliases[id] ?? ids.find((key) => key === id);
}

// 完整刷新会重播入场，同一文档内返回首页沿用已完成的状态。
let entryPlayed = false;

export function ShowcaseDeck({ children, footer }: { children: React.ReactNode; footer: React.ReactNode }) {
  const [frame, setFrame] = useState(first);
  const [loading, setLoading] = useState(() => !entryPlayed);
  const [footerOpen, setFooterOpen] = useState(false);
  const current = useRef<ChapterId>("index");
  const atFooter = useRef(false);
  const footerPanel = useRef<HTMLDivElement>(null);
  const finish = useRef(0);

  const finishEntry = useCallback(() => {
    entryPlayed = true;
    setLoading(false);
  }, []);

  const show = useCallback((hash: string, mode: "push" | "replace" | "restore", instantly = false) => {
    const next = chapterAt(hash);
    if (!next) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const footer = hash === "#site-footer";
    atFooter.current = footer;
    setFooterOpen(footer);
    if (mode !== "restore" && location.hash !== hash) {
      if (mode === "push") history.pushState(history.state, "", hash);
      else history.replaceState(history.state, "", hash);
    }
    if (current.current === next) return;
    const previous = current.current;
    current.current = next;
    window.clearTimeout(finish.current);
    const animated = !instantly && !reduced;
    if (document.getElementById(previous)?.contains(document.activeElement)) {
      document.getElementById("chapter-stage")?.focus({ preventScroll: true });
    }
    setFrame({ current: next, previous: animated ? previous : null });
    if (animated) finish.current = window.setTimeout(() => setFrame({ current: next, previous: null }), 1000);
  }, []);

  useLayoutEffect(() => {
    const restore = () => {
      const hash = location.hash || "#index";
      if (chapterAt(hash) !== current.current) {
        document.querySelectorAll<HTMLDialogElement>("dialog[open]").forEach((dialog) => dialog.requestClose());
      }
      show(hash, "restore", true);
    };
    restore();
    window.addEventListener("hashchange", restore);
    window.addEventListener("popstate", restore);
    return () => {
      window.clearTimeout(finish.current);
      window.removeEventListener("hashchange", restore);
      window.removeEventListener("popstate", restore);
    };
  }, [show]);

  useLayoutEffect(() => {
    if (loading) return;
    if (footerOpen) footerPanel.current?.focus({ preventScroll: true });
    else if (footerPanel.current?.contains(document.activeElement)) {
      document.getElementById("chapter-stage")?.focus({ preventScroll: true });
    }
  }, [footerOpen, loading]);

  useEffect(() => {
    if (loading) return;
    let lastMove = -Infinity;
    let lastWheel = -Infinity;
    let sum = 0;
    let used = false;
    let touch: { x: number; y: number } | null = null;
    function step(delta: number) {
      const n = ids.indexOf(current.current);
      const footer = atFooter.current;
      if (footer && delta < 0) { show("#more", "replace"); return; }
      if (footer && delta > 0) return;
      if (n + delta >= ids.length) show("#site-footer", "push");
      else if (n + delta >= 0) show("#" + ids[n + delta], "replace");
    }
    function gestureTarget(target: EventTarget | null) {
      return !document.querySelector("dialog[open]") && !(target instanceof Element && target.closest("input,textarea,select,video[controls],[contenteditable=true]"));
    }
    function wheel(event: WheelEvent) {
      if (!gestureTarget(event.target) || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      if (!delta) return;
      event.preventDefault();
      const now = performance.now();
      if (now - lastWheel > 170 || Math.sign(delta) !== Math.sign(sum)) { sum = 0; used = false; }
      lastWheel = now;
      sum += delta;
      if (used || Math.abs(sum) < 25 || now - lastMove < 920) return;
      used = true;
      lastMove = now;
      step(Math.sign(sum));
    }
    function key(event: KeyboardEvent) {
      if (event.altKey || event.metaKey || event.ctrlKey || event.defaultPrevented || !gestureTarget(event.target)) return;
      if (!["ArrowDown","ArrowUp","PageDown","PageUp","Home","End"].includes(event.key)) return;
      if (event.target instanceof Element && event.target.closest("[data-local-keys]") && ["Home", "End"].includes(event.key)) return;
      event.preventDefault();
      if (event.repeat) return;
      if (event.key === "Home") show("#index", "push");
      else if (event.key === "End") show("#site-footer", "push");
      else step(event.key === "ArrowDown" || event.key === "PageDown" ? 1 : -1);
    }
    function start(event: TouchEvent) {
      touch = gestureTarget(event.target) && event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
    }
    function end(event: TouchEvent) {
      if (!touch || !event.changedTouches.length) return;
      const dx = touch.x - event.changedTouches[0].clientX;
      const dy = touch.y - event.changedTouches[0].clientY;
      touch = null;
      if (Math.abs(dy) < 44 || Math.abs(dy) < Math.abs(dx) * 1.25) return;
      if (event.cancelable) event.preventDefault();
      step(Math.sign(dy));
    }
    window.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("keydown", key);
    window.addEventListener("touchstart", start, { passive: true });
    window.addEventListener("touchend", end, { passive: false });
    return () => {
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("keydown", key);
      window.removeEventListener("touchstart", start);
      window.removeEventListener("touchend", end);
    };
  }, [show, loading]);

  function click(event: MouseEvent<HTMLDivElement>) {
    if (event.button || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    const anchor = event.target instanceof Element ? event.target.closest("a") : null;
    if (!anchor || anchor.target === "_blank" || anchor.origin !== location.origin || anchor.pathname !== "/" || !chapterAt(anchor.hash)) return;
    event.preventDefault();
    show(anchor.hash, "push");
    if (anchor.hash === "#contact" || anchor.hash === "#honors") window.dispatchEvent(new HashChangeEvent("hashchange"));
  }

  const direction = frame.previous && ids.indexOf(frame.current) < ids.indexOf(frame.previous) ? "back" : "forward";
  const fade = frame.previous && [frame.current, frame.previous].every((id) => id === "index" || id === "information");
  return <DeckContext.Provider value={{ ...frame, interactive: !loading && !footerOpen }}>
    <div className="showcase" onClickCapture={click} data-footer={footerOpen} data-chapter={frame.current} data-direction={direction} data-transition={fade ? "fade" : "wipe"}>
      <div className="showcase-track" inert={loading}>
        <div inert={footerOpen}>{children}</div>
        <div ref={footerPanel} tabIndex={-1} inert={!footerOpen}>{footer}</div>
      </div>
      {loading && <EntryLoader onFinish={finishEntry} />}
    </div>
  </DeckContext.Provider>;
}
