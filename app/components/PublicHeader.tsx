import Image from "next/image";
import Link from "next/link";
import { channels } from "../showcase/content";
import styles from "./navigation.module.css";

export { PublicHeader } from "./SiteNavigation";

export function PublicFooter({ home = false }: { home?: boolean }) {
  const HomeLink = home ? "a" : Link;
  const homeHref = home ? "#index" : "/#index";
  return (
    <footer className={styles.footer} id="site-footer" aria-label="战队页脚">
      <HomeLink className={styles.footerBrand} href={homeHref}><Image src="/images/brand/polarbear.png" alt="" width={68} height={68} /><span>POLAR BEAR<small>深圳北理莫斯科大学 · 北极熊机器人战队</small></span></HomeLink>
      <nav aria-label="页脚导航"><Link href="/groups">组别介绍</Link><Link href="/apply">在线投递</Link><Link href="/admin/login">队员登录</Link><a href={channels.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={channels.bilibili} target="_blank" rel="noreferrer">哔哩哔哩 ↗</a></nav>
      <HomeLink className={styles.backTop} href={homeHref} aria-label="返回首页">↑</HomeLink>
    </footer>
  );
}
