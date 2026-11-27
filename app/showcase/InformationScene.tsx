"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { news, newsCategories } from "./content";
import { useShowcase } from "./ShowcaseDeck";

export function InformationScene() {
  const { current } = useShowcase();
  const [category, setCategory] = useState<string>("全部");
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const touchX = useRef<number | null>(null);
  const swiped = useRef(false);
  const items = news.filter((item) => category === "全部" || item.category === category);
  const item = news[index];

  useEffect(() => {
    if (current !== "information" || hovered || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => { if (!document.hidden) setIndex((n) => (n + 1) % news.length); }, 7000);
    return () => window.clearInterval(timer);
  }, [current, index, hovered]);

  return <>
    <div className="screen-word" aria-hidden="true">BREAKING NEWS</div>
    <div className="news-layout">
      <div className="news-sidebar">
        <div className="news-categories" aria-label="情报分类">{newsCategories.map((name) => <button type="button" key={name} aria-pressed={category === name} onClick={() => setCategory(name)}>{name}</button>)}</div>
        <div className="news-list" key={category}>{items.map((story) => <a key={story.slug} href={"/news/" + story.slug} target="_blank" rel="noreferrer">
          <b>{story.category}</b><span><small>{story.en}</small>{story.title}</span>
        </a>)}</div>
        <a className="news-more" href="/news" target="_blank" rel="noreferrer">更多情报 <small>READ MORE</small><b>›</b></a>
      </div>
      <a className="news-cover" href={"/news/" + item.slug} target="_blank" rel="noreferrer" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)} onBlur={() => setHovered(false)}
        onPointerDown={(e) => { touchX.current = e.clientX; swiped.current = false; }}
        onPointerUp={(e) => {
          if (touchX.current !== null && Math.abs(e.clientX - touchX.current) > 40) {
            swiped.current = true;
            setIndex((index + (e.clientX < touchX.current ? 1 : -1) + news.length) % news.length);
          }
          touchX.current = null;
        }}
        draggable={false} onClick={(e) => { if (swiped.current) e.preventDefault(); swiped.current = false; }} aria-label={"阅读“" + item.title + "”"}>
        <Image key={item.image} src={item.image} alt="" fill draggable={false} sizes="(orientation:portrait) 100vw, 65vw" />
        <span className="news-cover-copy"><small>{item.en}</small><strong>{item.title}</strong><i>阅读详情 ↗</i></span>
      </a>
      <div className="news-dots" aria-label="切换封面">{news.map((story, n) => <button type="button" key={story.slug} onClick={() => setIndex(n)} aria-label={story.title} aria-pressed={n === index} />)}</div>
    </div>
  </>;
}
