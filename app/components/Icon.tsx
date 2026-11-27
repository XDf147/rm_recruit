export type IconName = "share" | "sound" | "user" | "menu" | "close" | "arrow" | "down" | "apply" | "group" | "github" | "video" | "mail" | "focus" | "layers" | "globe";

const paths: Record<IconName, React.ReactNode> = {
  share: <><path d="m7 12 10-7M7 12l10 7" /><path d="m3 12 3-3 3 3-3 3zm11-8 3-3 3 3-3 3zm0 16 3-3 3 3-3 3z" fill="currentColor" /></>,
  sound: <path d="M3 10v4m4-8v12m5-16v20m5-16v12m4-8v4" />,
  user: <><circle cx="12" cy="7" r="4" /><path d="M4 21v-4c0-5 16-5 16 0v4z" /></>,
  menu: <path d="M2 5h20M2 12h20M2 19h20" />,
  close: <path d="m4 4 16 16M20 4 4 20" />,
  arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
  down: <path d="m2 6 10 10L22 6" />,
  apply: <><path d="M4 3h10l5 5v13H4zM14 3v6h5M7 13h8m-8 4h5" /></>,
  group: <><path d="m12 2 8 4-8 4-8-4zm-8 9 8 4 8-4M4 16l8 4 8-4" /></>,
  github: <><path d="M8 20H6c-3 0-3-3-5-3m8 5v-4c-4-1-6-3-6-7 0-2 1-3 2-4 0-1 0-3 1-4l4 2a12 12 0 0 1 5 0l4-2c1 1 1 3 1 4 1 1 2 2 2 4 0 4-2 6-6 7v4" /></>,
  video: <><rect x="2" y="5" width="20" height="15" rx="3" /><path d="m7 2 3 3m7-3-3 3m-4 4 5 3-5 3z" /></>,
  mail: <><path d="M2 4h20v16H2zm0 1 10 8L22 5" /></>,
  focus: <><path d="M3 8V3h5m8 0h5v5m0 8v5h-5m-8 0H3v-5" /><circle cx="12" cy="12" r="3" /></>,
  layers: <><path d="m2 9 10-6 10 6-10 6zM3 14l9 6 9-6" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" /></>,
};

export function Icon({ name }: { name: IconName }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="round">{paths[name]}</svg>;
}
