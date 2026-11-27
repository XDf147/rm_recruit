"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { channels } from "./content";
import { MediaLightbox } from "./MediaLightbox";

const films = [
  { title: "RoboMaster 赛场", category: "赛场影像", src: "/media/robomaster-arena.mp4", poster: "/images/showcase/arena.webp", captions: "/media/arena.zh.vtt" },
  { title: "仿真场地漫游", category: "战队仿真", src: "/media/arena-flyover.mp4", poster: "/images/showcase/arena-flyover.webp", captions: "/media/flyover.zh.vtt" },
  { title: "机器人场地巡游", category: "战队仿真", src: "/media/arena-navigation.mp4", poster: "/images/showcase/arena-navigation.webp", captions: "/media/navigation.zh.vtt" },
];
type Film = (typeof films)[number];

function FilmPlayer({ film, onClose }: { film: Film; onClose: () => void }) {
  return <MediaLightbox title={film.title} onClose={onClose}>
    <video className="full-film" src={film.src} poster={film.poster} controls autoPlay playsInline>
      <track kind="captions" src={film.captions} srcLang="zh" label="中文" />
    </video>
  </MediaLightbox>;
}

export function MediaTheater({ active }: { active: boolean }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const preview = useRef<HTMLVideoElement>(null);
  const film = films[index];
  useEffect(() => {
    const video = preview.current;
    if (!video || !active || playing) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    function sync() {
      if (!video) return;
      if (document.hidden || reduced.matches) video.pause();
      else void video.play().catch(() => {});
    }
    sync();
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    return () => {
      video.pause();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
    };
  }, [film.src, active, playing]);
  return <>
    <button className="theater-preview" type="button" aria-label={"播放" + film.title} onClick={() => setPlaying(true)}>
      <video key={film.src} ref={preview} src={film.src} poster={film.poster} muted playsInline loop preload="metadata" aria-hidden="true" />
      <span className="theater-play" aria-hidden="true"><i /></span>
    </button>
    <div className="theater-collection">
      <div className="theater-info" key={film.src}><small>{film.category}</small><h2>{film.title}</h2></div>
      <div className="theater-strip">
        <button type="button" className="film-arrow" aria-label="上一段影像" disabled={index === 0} onClick={() => setIndex(index - 1)}>‹</button>
        <div className="film-items">{films.map((entry,n) => <button key={entry.src} type="button" aria-label={entry.title} aria-pressed={index === n} onClick={() => n === index ? setPlaying(true) : setIndex(n)}>
          <Image src={entry.poster} alt="" fill sizes="(orientation:portrait) 24vw, 12vw" />
        </button>)}</div>
        <button type="button" className="film-arrow" aria-label="下一段影像" disabled={index === films.length - 1} onClick={() => setIndex(index + 1)}>›</button>
      </div>
    </div>
    <span className="theater-word" aria-hidden="true">VIDEO</span>
    {active && playing && <FilmPlayer film={film} onClose={() => setPlaying(false)} />}
  </>;
}

export function FilmLibrary() {
  const [selected, setSelected] = useState<Film | null>(null);
  return <main className="film-library"><div className="film-library-heading"><div><small>VIDEO ARCHIVE</small><h1>影像列表</h1></div>
    <a href={channels.bilibili} target="_blank" rel="noreferrer">战队哔哩哔哩 ↗</a></div>
    <div className="film-library-grid">{films.map((film) => <button type="button" key={film.src} onClick={() => setSelected(film)}>
      <span><Image src={film.poster} alt="" fill sizes="(orientation:portrait) 90vw, 30vw" /><i aria-hidden="true">▶</i></span>
      <small>{film.category}</small><strong>{film.title}</strong>
    </button>)}</div>
    <Link className="film-library-back" href="/#media">‹ 返回战队影像</Link>
    {selected && <FilmPlayer film={selected} onClose={() => setSelected(null)} />}
  </main>;
}
