"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LoginForm } from "../admin/login/LoginForm";
import { chapters, channels, type ChapterId } from "../showcase/content";
import { useShowcase } from "../showcase/ShowcaseDeck";
import { Icon } from "./Icon";
import { SiteDialog } from "./SiteDialog";
import styles from "./navigation.module.css";

export function PublicHeader({ active }: { active?: "groups" | "apply" | "information" | "media" }) {
  const home = active === undefined;
  const { current } = useShowcase();
  const chapter = home ? current : active === "groups" ? "world" : active === "apply" ? "more" : active;
  const [overlay, setOverlay] = useState<"menu" | "login" | null>(null);
  const [share, setShare] = useState(false);
  const [copyState, setCopyState] = useState("");
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const tools = useRef<HTMLDivElement>(null);
  const shareToggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function quietForMedia(event: Event) {
      if (event.target instanceof HTMLMediaElement && event.target !== audio.current && !event.target.muted) audio.current?.pause();
    }
    document.addEventListener("play", quietForMedia, true);
    return () => document.removeEventListener("play", quietForMedia, true);
  }, []);
  useEffect(() => {
    if (!share) return;
    function outside(event: PointerEvent | FocusEvent) {
      if (!tools.current?.contains(event.target as Node)) setShare(false);
    }
    function close(event: KeyboardEvent) {
      if (event.key === "Escape") { setShare(false); shareToggle.current?.focus(); }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
      document.removeEventListener("keydown", close);
    };
  }, [share]);

  const dest = (id: ChapterId) => (home ? "#" : "/#") + id;
  const links = chapters.map((item) => (
    <a key={item.id} href={dest(item.id)} aria-current={chapter === item.id ? "location" : undefined}>
      <b>{item.en}</b><span>{item.name}</span>
    </a>
  ));

  async function toggleAudio() {
    const player = audio.current;
    if (!player) return;
    if (!player.paused) { player.pause(); return; }
    player.volume = 0.28;
    try { await player.play(); } catch { setPlaying(false); }
  }

  return <header className={home ? styles.homeHeader : styles.innerHeader}>
    <Link href={dest("index")} className={styles.brand} aria-label="北极熊机器人战队首页">
      <Image src="/images/brand/polarbear.png" alt="" width={54} height={54} priority />
      <span>POLAR BEAR<small>北极熊机器人战队</small></span>
    </Link>
    <nav className={styles.nav} aria-label="主导航">{links}</nav>
    <div className={styles.tools}>
      <div className={styles.shareTool} ref={tools}>
        <button ref={shareToggle} type="button" aria-label="分享当前页面" title="分享" aria-expanded={share} aria-controls="share-tools" onClick={() => { setCopyState(""); setShare(!share); }}><Icon name="share" /></button>
        <div className={styles.sharePanel} id="share-tools" data-open={share} inert={!share} aria-hidden={!share}>
          <small>TOOLBOX</small><div>
            <a href={channels.bilibili} aria-label="战队哔哩哔哩" title="战队哔哩哔哩" target="_blank" rel="noreferrer"><Icon name="video" /></a>
            <a href={channels.github} aria-label="战队 GitHub" title="战队 GitHub" target="_blank" rel="noreferrer"><Icon name="github" /></a>
            <button type="button" aria-label="复制页面链接" title="复制页面链接" onClick={async () => {
              try { await navigator.clipboard.writeText(location.href); setCopyState("链接已复制"); }
              catch { setCopyState(location.href); }
            }}><Icon name="share" /></button>
          </div>{copyState && <span role="status">{copyState}</span>}
        </div>
      </div>
      <button type="button" aria-label={playing ? "关闭背景原声" : "开启背景原声"} aria-pressed={playing} title={playing ? "关闭背景原声" : "开启背景原声"} onClick={toggleAudio} className={styles.sound}>
        <span className={styles.equalizer} aria-hidden="true"><i /><i /><i /><i /><i /></span>
      </button>
      <button type="button" aria-label="队员登录" title="队员登录" onClick={() => setOverlay("login")}><Icon name="user" /></button>
      <button type="button" className={styles.menuButton} aria-label="打开导航菜单" aria-haspopup="dialog" aria-expanded={overlay === "menu"} onClick={() => setOverlay("menu")}><Icon name="menu" /></button>
    </div>
    <audio ref={audio} src="/media/robomaster-arena.mp4" preload="none" loop onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}><track kind="captions" src="/media/arena.zh.vtt" srcLang="zh" label="中文" /></audio>
    {overlay === "menu" && <SiteDialog menu title="站点导航" label="POLAR BEAR" onClose={() => setOverlay(null)}>
      <nav className={styles.menuLinks} aria-label="移动导航">{links}</nav>
      <Link className={styles.menuApply} href="/apply"><b>RECRUITMENT</b><span>加入战队</span></Link>
      <div className={styles.menuChannels}><small>TOOLBOX</small><a href={channels.github} target="_blank" rel="noreferrer" aria-label="战队 GitHub"><Icon name="github" /></a><a href={channels.bilibili} target="_blank" rel="noreferrer" aria-label="战队哔哩哔哩"><Icon name="video" /></a><a href={channels.email} aria-label="战队邮箱"><Icon name="mail" /></a></div>
    </SiteDialog>}
    {overlay === "login" && <SiteDialog title="队员登录" label="MEMBER SIGN IN" onClose={() => setOverlay(null)}><LoginForm embedded /></SiteDialog>}
  </header>;
}
