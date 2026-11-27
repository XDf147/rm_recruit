"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "../components/Icon";
import { useShowcase } from "./ShowcaseDeck";
import { channels } from "./content";

const shortcuts: Array<{ name: string; en: string; href: string; icon: IconName }> = [
  { name: "加入战队", en: "APPLICATION", href: "/apply", icon: "apply" },
  { name: "组别介绍", en: "TEAM UNITS", href: "/groups", icon: "group" },
  { name: "战队视频", en: "BILIBILI", href: channels.bilibili, icon: "video" },
  { name: "开源项目", en: "GITHUB", href: channels.github, icon: "github" },
  { name: "联系我们", en: "CONTACT", href: channels.email, icon: "mail" },
];

export function IndexScene() {
  const { current, previous } = useShowcase();
  const visibleScene = current === "index" || previous === "index";
  const film = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const video = film.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    function sync() {
      if (!video) return;
      if (!visibleScene || document.hidden || paused || reduced.matches) video.pause();
      else void video.play().catch(() => {});
    }
    sync();
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => { reduced.removeEventListener("change", sync); document.removeEventListener("visibilitychange", sync); };
  }, [paused, visibleScene]);

  return <>
    <video ref={film} className="index-film" src="/media/robomaster-arena.mp4" poster="/images/showcase/arena.webp" loop muted playsInline preload="none" aria-hidden="true" />
    <div className="index-grade" />
    <svg className="index-stencil" viewBox="0 0 600 800" preserveAspectRatio="none" aria-hidden="true">
      <defs><mask id="pb-stencil" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="800">
        <rect width="600" height="800" fill="white" />
        <text x="-40" y="832" fontSize="544" textLength="680" lengthAdjust="spacingAndGlyphs" fontFamily="Arial, sans-serif" fontWeight="900" fill="black">PB</text>
      </mask></defs>
      <rect width="600" height="800" fill="currentColor" mask="url(#pb-stencil)" />
    </svg>
    <div className="index-signature">
      <div><h1>POLAR BEAR</h1><p><b>北极熊机器人战队</b><span>SHENZHEN MSU-BIT UNIVERSITY</span></p></div>
      <small>以我之眼，探索无限 <i /> ROBOMASTER TEAM</small>
    </div>
    <nav className="index-shortcuts" aria-label="战队快捷入口">
      {shortcuts.map((item) => {
        const content = <><Icon name={item.icon} /><span><b>{item.name}</b><small>{item.en}</small></span></>;
        return item.href.startsWith("/") ? <Link key={item.en} href={item.href}>{content}</Link> :
          <a key={item.en} href={item.href} target={item.href.startsWith("https") ? "_blank" : undefined} rel="noreferrer">{content}</a>;
      })}
    </nav>
    <Link className="index-season" href="/apply"><Image src="/images/brand/polarbear.png" alt="" width={44} height={44} /><span><b>2027</b><small>战队招新 ↗</small></span></Link>
    <button type="button" className="film-toggle" aria-label={paused ? "继续播放背景影像" : "暂停背景影像"} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "▷" : "Ⅱ"}</button>
  </>;
}
