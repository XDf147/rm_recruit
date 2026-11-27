"use client";

import { useShowcase } from "./ShowcaseDeck";
import { chapters, type ChapterId } from "./content";

export function Scene({ id, children }: { id: ChapterId; children: React.ReactNode }) {
  const { current, previous } = useShowcase();
  const state = id === current ? (previous ? "enter" : "active") : id === previous ? "exit" : "idle";
  const index = chapters.findIndex((item) => item.id === id);
  const chapter = chapters[index];
  const next = chapters[index + 1];
  const number = String(index).padStart(2, "0");

  return (
    <section id={id} className={`scene scene-${id}`} aria-label={chapter.name} data-state={state} inert={id !== current} aria-hidden={id !== current}>
      {children}
      <div className="scene-footline" aria-hidden="true" />
      <div className="scene-rail" aria-hidden="true">
        <div className="scene-meter"><strong>{number}</strong><span>{"// "}{number} / 05<small>POLAR BEAR</small></span><b>{chapter.marker}</b></div>
      </div>
      <a className="scene-scroll" href={next ? "#" + next.id : "#index"} aria-label={next ? "下一屏，" + next.name : "返回首页"}>
        <span>SCROLL</span><i />
      </a>
    </section>
  );
}
