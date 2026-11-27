"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { Icon } from "../components/Icon";
import { robots } from "./content";
import { RobotVoice } from "./RobotVoice";

export function RobotArchive() {
  const [selection, setSelection] = useState({ index: 0, zoom: false });
  const [portrait, setPortrait] = useState(selection);
  const [phase, setPhase] = useState<"ready" | "leave" | "arrive">("ready");
  const [scroll, setScroll] = useState({ position: 0, max: 1, thumb: 66 });
  const timer = useRef(0);
  const track = useRef<HTMLDivElement>(null);
  const robot = robots[portrait.index];

  useEffect(() => {
    const row = track.current;
    if (!row) return;
    function measure() {
      if (row) setScroll({ position: Math.round(row.scrollLeft), max: row.scrollWidth - row.clientWidth, thumb: 100 * row.clientWidth / row.scrollWidth });
    }
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    row.addEventListener("scroll", measure, { passive: true });
    return () => { window.clearTimeout(timer.current); observer.disconnect(); row.removeEventListener("scroll", measure); };
  }, []);

  function choose(n: number, zoom = false, focus = false) {
    const index = (n + robots.length) % robots.length;
    const next = { index, zoom };
    if (next.index !== selection.index || next.zoom !== selection.zoom) {
      setSelection(next);
      window.clearTimeout(timer.current);
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setPortrait(next); setPhase("ready"); }
      else {
        setPhase("leave");
        timer.current = window.setTimeout(() => { setPortrait(next); setPhase("arrive"); }, 300);
      }
    }
    const row = track.current;
    const card = row?.querySelectorAll("button")[index];
    if (!row || !card) return;
    if (focus) card.focus({ preventScroll: true });
    const left = card.offsetLeft, right = left + card.offsetWidth;
    if (left < row.scrollLeft || right > row.scrollLeft + row.clientWidth) {
      row.scrollTo({ left: left < row.scrollLeft ? left : right - row.clientWidth, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
  }

  function keys(event: KeyboardEvent<HTMLButtonElement>) {
    let next = selection.index;
    if (event.key === "ArrowRight") next++;
    else if (event.key === "ArrowLeft") next--;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = robots.length - 1;
    else return;
    event.preventDefault();
    choose(next, false, true);
  }

  return <>
    <div className="robot-ghost" data-motion={phase} aria-hidden="true" style={{ backgroundImage: `url("${robot.image}")` }} />
    <div className="robot-word" aria-hidden="true">{robot.en}</div>
    <p className="robot-kicker"><small>ROBOMASTER ://</small><b>PROFILE</b></p>
    <div className={`robot-figure ${portrait.zoom ? "zoomed" : ""}`} data-motion={phase}>
      <Image key={robot.id + portrait.zoom} src={robot.image} alt={`RoboMaster ${robot.name}兵种定妆照`} fill unoptimized sizes="(orientation:portrait) 90vw, 50vw" />
    </div>
    <article id="robot-profile" className="robot-copy" data-motion={phase} aria-live="polite" aria-labelledby={"card-" + robot.id} role="tabpanel">
      <small>{robot.en}</small><h2>{robot.name}<span>机器人兵种</span></h2>
      <RobotVoice key={robot.id} id={robot.id} role={robot.role} />
      <p>{robot.description}</p>
    </article>
    <div className="robot-selector">
      <div className="robot-cards" ref={track} role="tablist" aria-label="切换兵种" data-local-keys>
        {robots.map((item, n) => <button type="button" role="tab" aria-selected={n === selection.index} aria-controls="robot-profile" id={"card-" + item.id} key={item.id} tabIndex={n === selection.index ? 0 : -1} onKeyDown={keys} onClick={() => choose(n)}>
          <span className="card-picture"><Image src={item.image} alt="" fill unoptimized sizes="110px" /></span>
          <span className="card-caption"><small>{item.en}</small><b>{item.name}</b></span>
        </button>)}
      </div>
      <div className="card-controls">
        <button type="button" aria-label="上一个兵种" onClick={() => choose(selection.index - 1)}>‹</button>
        <input type="range" min="0" max={scroll.max} value={scroll.position} style={{ "--thumb": scroll.thumb + "%" } as CSSProperties} aria-label="滚动兵种卡带" onChange={(e) => track.current?.scrollTo({ left: Number(e.target.value), behavior: "instant" })} />
        <button type="button" aria-label="下一个兵种" onClick={() => choose(selection.index + 1)}>›</button>
      </div>
    </div>
    <div className="robot-views" aria-label="主图视图">
      <button type="button" aria-pressed={!selection.zoom} title="整机视图" aria-label="整机视图" onClick={() => choose(selection.index, false)}><Icon name="layers" /></button>
      <button type="button" aria-pressed={selection.zoom} title="局部特写" aria-label="局部特写" onClick={() => choose(selection.index, true)}><Icon name="focus" /></button>
    </div>
  </>;
}
