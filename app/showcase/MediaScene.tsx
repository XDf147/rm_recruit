"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MediaGallery } from "./MediaGallery";
import { MediaTheater } from "./MediaTheater";
import { useShowcase } from "./ShowcaseDeck";

const rooms = [
  { id: "gallery", name: "画廊", en: "GALLERY", title: "战队画廊", description: "赛场与工作室的影像记录" },
  { id: "video", name: "放映室", en: "VIDEO", title: "赛场放映室", description: "RoboMaster 赛场与战队影像" },
] as const;
type Room = (typeof rooms)[number]["id"];

export function MediaScene() {
  const { current } = useShowcase();
  const [selected, setSelected] = useState<Room | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [inside, setInside] = useState(false);
  const trigger = useRef<HTMLElement | null>(null);
  const back = useRef<HTMLButtonElement>(null);
  const item = rooms.find((entry) => entry.id === selected);
  function open(id: Room, control: HTMLElement) {
    trigger.current = control;
    setRoom(id); setInside(true);
  }
  function choose(id: Room, control: HTMLElement) {
    if (id === selected) open(id, control);
    else setSelected(id);
  }
  function returnToDesk() {
    setInside(false);
    requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
  }
  useEffect(() => {
    if (!inside || current !== "media") return;
    back.current?.focus({ preventScroll: true });
    function key(event: KeyboardEvent) {
      if (event.key === "Escape" && !event.defaultPrevented && !document.querySelector("dialog[open]")) {
        event.preventDefault(); returnToDesk();
      }
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [inside, current]);

  return <div className="media-room" data-page={inside ? room : "home"}>
    <div className="media-overview" inert={inside} aria-hidden={inside}>
      <div className="desk-clear" onPointerDown={() => setSelected(null)} />
      <div className="screen-word" aria-hidden="true">TEAM MEDIA</div>
      <div className="media-workbench">
        <Image src="/images/showcase/media-desk.webp" fill sizes="(orientation:portrait) 107vw, 54vw" alt="" />
        {rooms.map((device) => <button type="button" key={device.id} className={"desk-hotspot desk-" + device.id}
          aria-label={device.name} aria-pressed={selected === device.id} data-selected={selected === device.id}
          onClick={(event) => choose(device.id, event.currentTarget)}>
          <i className="desk-block" /><i className="desk-frame" />
          <Image className="desk-illumination" src={"/images/showcase/media-" + device.id + "-active.webp"} fill unoptimized alt="" sizes="30vw" />
          <span className="desk-label"><i />{device.en}</span>
          <span className="desk-badge"><Image src={"/images/showcase/media-" + device.id + "-badge.webp"} width={device.id === "gallery" ? 76 : 66} height={device.id === "gallery" ? 50 : 51} alt="" unoptimized /><b>{device.en}</b></span>
          <i className="desk-hit" />
        </button>)}
      </div>
      <div className="media-choices"><span className="section-tag">TEAM MEDIA</span>
        {rooms.map((device) => <button type="button" key={device.id} aria-pressed={selected === device.id} onClick={(e) => choose(device.id, e.currentTarget)}>{device.en} <span>{device.name}</span></button>)}
      </div>
      <div className="media-title" key={selected ?? "intro"}><span>{item?.en ?? "TEAM MEDIA"}</span><h2>{item?.title ?? "战队影像"}</h2><i /><p>{item?.description ?? "浏览赛场图集与影像记录"}</p></div>
      <button type="button" className="media-read" inert={!selected} aria-hidden={!selected} onClick={(e) => selected && open(selected,e.currentTarget)}>查看详情 <small>READ MORE</small><b>›</b></button>
    </div>
    <div className="media-viewer" data-open={inside} inert={!inside} aria-hidden={!inside} role="region" aria-label={room === "video" ? "赛场放映室" : "战队画廊"}>
      {room === "gallery" && <MediaGallery active={inside && current === "media"} />}
      {room === "video" && <MediaTheater active={inside && current === "media"} />}
      <div className="media-return"><button ref={back} type="button" className="media-back" aria-label="返回影像工作台" onClick={returnToDesk}>‹ 返回 <small>GO BACK</small></button>
        {room === "video" && <a className="media-library" href="/archive/video" target="_blank" rel="noreferrer">影像列表 <small>ALL VIDEOS ↗</small></a>}
      </div>
    </div>
  </div>;
}
