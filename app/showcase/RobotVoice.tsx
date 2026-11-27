"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "../components/Icon";
import { useShowcase } from "./ShowcaseDeck";

const languages = [{ id: "zh", name: "中文" }, { id: "ru", name: "俄语" }] as const;

export function RobotVoice({ id, role }: { id: string; role: string }) {
  const { current } = useShowcase();
  const [language, setLanguage] = useState<(typeof languages)[number]>(languages[0]);
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const wave = useRef<HTMLCanvasElement>(null);
  const context = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const voice = audio.current;
    return () => { voice?.pause(); };
  }, [current, language]);
  useEffect(() => () => { if (context.current) void context.current.close(); }, []);
  useEffect(() => {
    if (!expanded) return;
    function outside(e: PointerEvent) {
      if (!menu.current?.contains(e.target as Node)) setExpanded(false);
    }
    function key(e: KeyboardEvent) { if (e.key === "Escape") { setExpanded(false); menu.current?.querySelector("button")?.focus(); } }
    document.addEventListener("pointerdown",outside);
    document.addEventListener("keydown",key);
    return () => { document.removeEventListener("pointerdown",outside); document.removeEventListener("keydown",key); };
  }, [expanded]);
  useEffect(() => {
    const meter = wave.current?.getContext("2d");
    const node = analyser.current;
    if (!playing || !meter || !node) return;
    const samples = new Uint8Array(node.fftSize);
    let frame = 0;
    function draw() {
      if (!node || !meter) return;
      node.getByteTimeDomainData(samples);
      const { width, height } = meter.canvas;
      meter.clearRect(0,0,width,height);
      meter.strokeStyle = "#19d1ff"; meter.lineWidth = 2; meter.beginPath();
      for (let i = 0; i < samples.length; i++) {
        const x = i * width / (samples.length - 1), y = height * (.5 + (samples[i] - 128) / 138);
        if (i === 0) meter.moveTo(x,y); else meter.lineTo(x,y);
      }
      meter.stroke();
      frame = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(frame); meter.clearRect(0,0,meter.canvas.width,meter.canvas.height); };
  }, [playing]);
  async function toggle() {
    const voice = audio.current;
    if (!voice) return;
    if (!voice.paused) { voice.pause(); voice.currentTime = 0; return; }
    if (!context.current && window.AudioContext) {
      const graph = new AudioContext();
      const meter = graph.createAnalyser();
      meter.fftSize = 256;
      graph.createMediaElementSource(voice).connect(meter);
      meter.connect(graph.destination);
      context.current = graph; analyser.current = meter;
    }
    await context.current?.resume();
    try { await voice.play(); } catch { setPlaying(false); }
  }
  return <div className="robot-role">
    <button className="voice-play" type="button" aria-label={playing ? "停止兵种播报" : "播放兵种播报"} aria-pressed={playing} onClick={toggle}><Icon name="sound" /></button>
    <div className="voice-menu" ref={menu}>
      <button type="button" className="voice-trigger" aria-expanded={expanded} aria-label="选择播报语言" onClick={() => setExpanded(!expanded)}>
        <small>PROFILE VOICE ▾</small><strong>{role} · {language.name}</strong>
      </button>
      {expanded && <div className="voice-options">{languages.map((item) => <button type="button" key={item.id} aria-pressed={item.id === language.id} onClick={() => { setLanguage(item); setExpanded(false); }}>{item.name}</button>)}</div>}
    </div>
    <canvas className="voice-wave" ref={wave} width={210} height={38} aria-hidden="true" data-playing={playing} />
    <audio ref={audio} src={"/media/profiles/" + id + "-" + language.id + ".mp3"} preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}>
      <track kind="captions" src={"/media/profiles/" + id + "-" + language.id + ".vtt"} srcLang={language.id} label={language.name} />
    </audio>
  </div>;
}
