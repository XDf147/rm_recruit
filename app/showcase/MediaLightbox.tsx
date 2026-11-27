"use client";

import { useEffect, useRef } from "react";

export function MediaLightbox({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const close = useRef(onClose);
  useEffect(() => { close.current = onClose; }, [onClose]);
  useEffect(() => {
    const dialog = ref.current!;
    const trigger = document.activeElement;
    dialog.showModal();
    function cancel(e: Event) { e.preventDefault(); close.current(); }
    dialog.addEventListener("cancel", cancel);
    return () => {
      dialog.removeEventListener("cancel", cancel); dialog.close();
      if (trigger instanceof HTMLElement && trigger.isConnected && !trigger.closest("[inert]")) trigger.focus({ preventScroll: true });
    };
  }, []);
  return <dialog className="media-lightbox" ref={ref} aria-label={title}>
    {children}
    <button type="button" className="lightbox-close" aria-label="关闭大图或播放器" onClick={onClose}>×</button>
  </dialog>;
}
