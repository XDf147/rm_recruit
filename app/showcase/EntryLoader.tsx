"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./entry-loader.module.css";

export function EntryLoader({ onFinish }: { onFinish: () => void }) {
  const logo = useRef<HTMLImageElement>(null);
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const tasks: Promise<unknown>[] = [document.fonts.load('800 16px "Barlow Condensed"')];
    if (logo.current) tasks.push(logo.current.decode());
    const film = document.querySelector<HTMLVideoElement>(".index-film");
    if (film?.poster) {
      const poster = new window.Image();
      poster.src = film.poster;
      tasks.push(poster.decode());
    }
    const cover = document.querySelector<HTMLImageElement>(".scene:target:not(.scene-index) img");
    if (cover) {
      cover.loading = "eager";
      tasks.push(cover.decode());
    }

    let active = true;
    let completed = 0;
    function advance() {
      if (active) setProgress(Math.round(++completed * 100 / tasks.length));
    }
    // 单张封面响应中断时，也允许访客进入已就绪的页面。
    const deadline = window.setTimeout(() => { active = false; setProgress(100); }, 8000);
    tasks.forEach((task) => { void task.then(advance, advance); });
    return () => { active = false; window.clearTimeout(deadline); };
  }, []);

  useEffect(() => {
    if (progress !== 100) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onFinish();
      return;
    }
    // 进度条用一秒抵达 100%，停留 300ms 后与参考页一样淡出一秒。
    const fade = window.setTimeout(() => setLeaving(true), 1300);
    const finish = window.setTimeout(onFinish, 2300);
    return () => { window.clearTimeout(fade); window.clearTimeout(finish); };
  }, [progress, onFinish]);

  return (
    <div className={styles.loader} data-leaving={leaving}>
      <div className={styles.brand}>
        <Image ref={logo} src="/images/brand/polarbear.png" alt="" width={88} height={100} loading="eager" />
        <span>POLAR BEAR<small>北极熊机器人战队</small></span>
      </div>
      <div className={styles.details}>
        <span className={styles.signature}>以我之眼，探索无限</span>
        <div className={styles.progress} role="progressbar" aria-label="正在载入战队网站"
          aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} style={{ "--entry-progress": progress } as CSSProperties}>
          <div className={styles.track}><i /></div>
          <div className={styles.caption} aria-hidden="true">
            <span className={styles.readout}><i />LOADING − <b />% &nbsp;......</span>
            <span>POLAR BEAR <em>{"//"}</em> ROBOMASTER TEAM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
