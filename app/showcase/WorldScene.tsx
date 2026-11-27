"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties } from "react";
import { GROUP_DETAILS } from "../../lib/groups";
import { WorldParticles } from "./WorldParticles";
import { WorldHover } from "./WorldHover";
import { useShowcase } from "./ShowcaseDeck";

const silhouettes = [
  "/images/showcase/rm23-sjtu-engineer.webp", "/images/showcase/rm23-neu-infantry.webp",
  "/images/showcase/rm23-scut-sentry.webp", "/images/showcase/rm23-neu-aerial.webp", "/images/brand/polarbear.png",
];
const mobileQuery = "(orientation:portrait)";
function watchMobile(update: () => void) {
  const query = matchMedia(mobileQuery);
  query.addEventListener("change", update);
  return () => query.removeEventListener("change", update);
}

export function WorldScene() {
  const [selected, setSelected] = useState<number | null>(null);
  const [entered, setEntered] = useState(false);
  const [direction, setDirection] = useState(1);
  const { current, interactive } = useShowcase();
  const mobile = useSyncExternalStore(watchMobile, () => matchMedia(mobileQuery).matches, () => false);
  const index = selected ?? 0;
  const group = GROUP_DETAILS[index];
  const detail = mobile || selected !== null;
  const list = useRef<HTMLDivElement>(null);
  const swipe = useRef(0);
  function step(delta: number) { setEntered(false); setDirection(Math.sign(delta)); setSelected((n) => ((n ?? 0) + delta + GROUP_DETAILS.length) % GROUP_DETAILS.length); }
  function back() {
    setSelected(null);
    requestAnimationFrame(() => list.current?.querySelectorAll("button")[index]?.focus({ preventScroll: true }));
  }
  useEffect(() => {
    if (current !== "world" || !interactive || !detail) return;
    function key(e: KeyboardEvent) {
      if (document.querySelector("dialog[open]") || e.altKey || e.metaKey || e.ctrlKey) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); step(e.key === "ArrowLeft" ? -1 : 1); }
      else if (e.key === "Escape" && !mobile) {
        setSelected(null);
        requestAnimationFrame(() => list.current?.querySelectorAll("button")[index]?.focus({ preventScroll: true }));
      }
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [current, interactive, detail, mobile, index]);

  return <div className="world-panel" data-detail={detail} data-opening={entered}>
    <div className="screen-word" aria-hidden="true">WORLD</div>
    <div className="world-visual" onTouchStart={(e) => { swipe.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => { const d = e.changedTouches[0].clientX - swipe.current; if (detail && Math.abs(d) > 45) step(d < 0 ? 1 : -1); }}>
      <WorldParticles src={detail ? silhouettes[index] : "/images/brand/polarbear.png"} active={current === "world"} />
    </div>
    <WorldHover menu={list} active={current === "world" && !detail} />
    <div className="world-choices" ref={list} inert={detail} aria-hidden={detail}>
      {GROUP_DETAILS.map((item, n) => <button type="button" key={item.slug} style={{ "--row": n } as CSSProperties} data-word={item.studio} data-hover-art={`/images/showcase/world-${item.slug}.webp`} onClick={() => { setEntered(true); setSelected(n); }}>
        <b>{item.name}</b><small>{item.studio}</small>
      </button>)}
      <Link href="/groups" style={{ "--row": GROUP_DETAILS.length } as CSSProperties} data-word="TEAM DIRECTORY" data-hover-art="/images/showcase/world-directory.webp"><b>全部组别</b><small>TEAM DIRECTORY</small></Link>
    </div>
    {detail && <div className="world-detail">
      <article className="world-detail-copy" key={group.slug} style={{ "--direction": direction } as CSSProperties} aria-live="polite">
        <h2><span>{group.name}</span></h2><strong><span>{group.studio}</span></strong><p><span>{group.description}</span></p>
        <Link href={`/groups/${group.slug}`}>打开组别档案 ↗</Link>
      </article>
      <button className="world-prev" type="button" aria-label="上一个组别" onClick={() => step(-1)}>❮</button>
      <button className="world-next" type="button" aria-label="下一个组别" onClick={() => step(1)}>❯</button>
      {!mobile && <button className="world-back" type="button" onClick={back}>返回 <small>GO BACK</small></button>}
      {mobile && <Link className="world-directory" href="/groups">全部组别 ↗</Link>}
      <div className="world-progress" role="group" aria-label="切换组别">
        {GROUP_DETAILS.map((item,n) => <button type="button" key={item.slug} aria-label={"查看" + item.name} aria-pressed={index === n} onClick={() => { if (index !== n) step(n - index); }} />)}
        <i aria-hidden="true" style={{ left: index * 100 / GROUP_DETAILS.length + "%", width: 100 / GROUP_DETAILS.length + "%" }} />
      </div>
    </div>}
  </div>;
}
