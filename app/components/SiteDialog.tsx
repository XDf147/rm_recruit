"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "./Icon";
import styles from "./navigation.module.css";

export function SiteDialog({ title, label, children, onClose, menu = false }: {
  title: string; label?: string; children: React.ReactNode; onClose: () => void; menu?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const timer = useRef(0);
  const [closing, setClosing] = useState(false);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    const trigger = document.activeElement;
    function selectMenuLink(event: MouseEvent) {
      if (menu && event.target instanceof Element && event.target.closest("a")) dialog?.requestClose();
    }
    dialog?.setAttribute("closedby", "any");
    dialog?.showModal();
    dialog?.addEventListener("click", selectMenuLink);
    return () => {
      window.clearTimeout(timer.current);
      dialog?.removeEventListener("click", selectMenuLink);
      dialog?.close();
      if (trigger instanceof HTMLElement && trigger.isConnected && !trigger.closest("[inert]")) trigger.focus({ preventScroll: true });
    };
  }, [menu]);

  function close() {
    if (timer.current) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { onClose(); return; }
    setClosing(true);
    timer.current = window.setTimeout(onClose, 240);
  }

  return <dialog ref={ref} className={menu ? styles.menuDialog : styles.dialog} data-closing={closing} aria-labelledby={titleId}
    onCancel={(e) => { e.preventDefault(); close(); }}>
    <div className={styles.dialogBody}>
      <header className={styles.dialogHead}>
        <div>{label && <small>{label}</small>}<h2 id={titleId}>{title}</h2></div>
        <button type="button" onClick={close} aria-label="关闭"><Icon name="close" /></button>
      </header>
      {children}
    </div>
  </dialog>;
}
