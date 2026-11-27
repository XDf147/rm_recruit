"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GROUP_DETAILS, groupCovers } from "../../lib/groups";
import { Icon, type IconName } from "../components/Icon";
import { SiteDialog } from "../components/SiteDialog";
import { channels } from "./content";
import { useShowcase } from "./ShowcaseDeck";

const doors = [
  { id: "apply", name: "加入战队", en: "RECRUITMENT", icon: "apply", image: "/images/groups/mechanical/平步装配.jpg" },
  { id: "honors", name: "荣誉档案", en: "TEAM HONORS", icon: "layers", image: "/images/groups/mechanical/赛场车图3.jpg" },
  { id: "contact", name: "联系战队", en: "CONTACT US", icon: "mail", image: "/images/groups/operations/赛场.jpg" },
] as const satisfies ReadonlyArray<{ id: string; name: string; en: string; icon: IconName; image: string }>;
type Topic = "apply" | "honors";
const report = "https://www.smbu.edu.cn/info/4631/110621.htm";

export function MoreScene() {
  const { current } = useShowcase();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [inside, setInside] = useState(false);
  const [contact, setContact] = useState(false);
  const [index, setIndex] = useState(0);
  const back = useRef<HTMLButtonElement>(null);
  const covers = useRef<HTMLDivElement>(null);
  const group = GROUP_DETAILS[index];
  const hiring = topic === "apply";
  function choose(id: Topic) { setTopic(id); setInside(true); }
  function returnToDoors() {
    setInside(false);
    if (location.hash === "#honors") history.replaceState(history.state, "", "#more");
    requestAnimationFrame(() => covers.current?.querySelector<HTMLElement>('[data-door="' + topic + '"]')?.focus({ preventScroll: true }));
  }
  useEffect(() => {
    function fromHash() {
      setContact(location.hash === "#contact");
      if (location.hash === "#honors") { setTopic("honors"); setInside(true); }
    }
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);
  useEffect(() => {
    if (!inside || current !== "more") return;
    back.current?.focus({ preventScroll: true });
    function keys(e: KeyboardEvent) {
      if (e.key === "Escape" && !document.querySelector("dialog[open]")) {
        e.preventDefault();
        setInside(false);
        if (location.hash === "#honors") history.replaceState(history.state, "", "#more");
        requestAnimationFrame(() => covers.current?.querySelector<HTMLElement>('[data-door="' + topic + '"]')?.focus({ preventScroll: true }));
      }
    }
    window.addEventListener("keydown", keys);
    return () => window.removeEventListener("keydown", keys);
  }, [inside, current, topic]);

  const options = hiring ? GROUP_DETAILS.map((item) => item.name) : ["2024 赛季"];
  return <>
    <div className="more-home" data-open={!inside} inert={inside}>
      <div className="more-doors" ref={covers}>{doors.map((item) => {
        const content = <><Image src={item.image} alt="" fill sizes="(orientation:portrait) 100vw, 34vw" /><div className="door-word"><Icon name={item.icon} /><span><strong>{item.name}</strong><small>{item.en}</small><i>VIEW MORE ›</i></span></div></>;
        return item.id === "contact" ? <a className="more-door" key={item.id} href="/#contact" target="_blank" rel="noreferrer">{content}</a> :
          <button className="more-door" type="button" data-door={item.id} key={item.id} onClick={() => choose(item.id)}>{content}</button>;
      })}</div>
      <div className="screen-word" aria-hidden="true">MORE CONTENT</div>
    </div>
    {topic && <div className="more-topic" role="region" aria-label={hiring ? "加入战队" : "荣誉档案"} data-open={inside} inert={!inside}>
      <Image key={hiring ? "cover-" + group.slug : "cover-honors"} className="topic-cover" src={hiring ? groupCovers[group.slug] : "/images/groups/mechanical/机械组.jpg"} fill sizes="100vw" alt="" />
      <div className="topic-tabs" role="group" aria-label={hiring ? "选择招新组别" : "选择赛季"}>{options.map((label,n) => <button type="button" key={label} aria-pressed={!hiring || n === index} onClick={() => hiring && setIndex(n)}>{label}<b>›</b></button>)}</div>
      <div className="screen-word" aria-hidden="true">{hiring ? "RECRUITMENT" : "TEAM HONORS"}</div>
      <div className="topic-copy" key={hiring ? group.slug : "award"}>
        <small>{hiring ? group.studio : "ROBOMASTER 2024"}</small><h2>{hiring ? group.name : "步兵机器人实战奖"}</h2>
        <p>{hiring ? group.fit : "北极熊参加了 2024 赛季高校联盟赛与超级对抗赛，并在赛季中获得步兵机器人实战奖。"}</p>
        {hiring ? <><a className="topic-action" href={"/groups/" + group.slug} target="_blank" rel="noreferrer">查看组别档案 ↗</a><Link className="topic-primary" href="/apply">在线投递 <b>›</b></Link></> :
          <a className="topic-primary" href={report} target="_blank" rel="noreferrer">查看学校报道 <b>↗</b></a>}
      </div>
      <div className="topic-progress" role="group" aria-label="切换主题">{options.map((label,n) => <button type="button" key={label} aria-label={label} aria-pressed={!hiring || n === index} onClick={() => hiring && setIndex(n)} />)}</div>
      <button className="topic-back" ref={back} type="button" onClick={returnToDoors}>‹ 返回 <small>GO BACK</small></button>
    </div>}
    {contact && <SiteDialog title="联系战队" label="CONTACT US" onClose={() => { setContact(false); if (location.hash === "#contact") history.replaceState(history.state, "", "#more"); }}>
      <div className="archive-list">
        <a href={channels.email}><small>EMAIL</small>polarbear_plan@163.com<b>↗</b></a>
        <a href={channels.bilibili} target="_blank" rel="noreferrer"><small>BILIBILI</small>住在实验室的北极熊<b>↗</b></a>
        <a href={channels.github} target="_blank" rel="noreferrer"><small>GITHUB</small>北极熊开源社区<b>↗</b></a>
      </div>
    </SiteDialog>}
  </>;
}
