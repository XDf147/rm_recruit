import Image from "next/image";
import Link from "next/link";

type ActivePage = "apply" | "events" | "robots" | "groups" | "honors" | "contact";

export function PublicHeader({ active }: { active?: ActivePage }) {
  const links: Array<{ key: ActivePage; href: string; label: string }> = [
    { key: "events", href: "/#events", label: "RM赛事" },
    { key: "robots", href: "/#robots", label: "机器人图鉴" },
    { key: "groups", href: "/groups", label: "组别介绍" },
    { key: "honors", href: "/#honors", label: "荣誉墙" },
    { key: "contact", href: "/#contact", label: "联系我们" },
  ];
  return (
    <header className="blueprint-header public-header">
      <Link className="brand" href="/" aria-label="RoboMaster 招新首页" transitionTypes={["nav-back"]}>
        <span className="brand-mark brand-logo">
          <Image src="/images/brand/polarbear.png" alt="" width={44} height={44} />
        </span>
          <span className="brand-copy">
            <b>北极熊机器人战队</b>
            <small>POLAR BEAR ROBOTICS</small>
        </span>
      </Link>
      <nav className="blueprint-nav" aria-label="公开站点导航">
        {links.map((link) => <Link className={active === link.key ? "active" : ""} href={link.href} key={link.key}>{link.label}</Link>)}
      </nav>
      <div className="public-actions">
        <Link className="login-pill" href="/admin/login">
          <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.25" /><path d="M5.75 20c.45-4 2.53-6 6.25-6s5.8 2 6.25 6" /></svg>
          <span>登录</span>
        </Link>
        <Link className={`join-pill ${active === "apply" ? "active" : ""}`} href="/apply" transitionTypes={["nav-forward"]}>
          <span>加入我们</span>
        </Link>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="footer-main">
        <section className="footer-identity">
          <Link href="/" className="footer-brand" aria-label="返回北极熊机器人战队首页">
            <Image src="/images/brand/polarbear.png" alt="" width={58} height={58} />
            <span><b>北极熊机器人战队</b><small>POLAR BEAR ROBOTICS</small></span>
          </Link>
          <p>深圳北理莫斯科大学 RoboMaster 机器人战队。把想法变成图纸，把图纸变成能抵达赛场的机器人。</p>
          <strong>保持好奇 · 持续迭代 · 并肩作战</strong>
        </section>

        <nav className="footer-nav" aria-label="页脚导航">
          <section>
            <small>EXPLORE / 探索</small>
            <Link href="/#events">RM 赛事</Link>
            <Link href="/#robots">机器人图鉴</Link>
            <Link href="/#honors">荣誉墙</Link>
          </section>
          <section>
            <small>TEAM / 战队</small>
            <Link href="/groups">组别介绍</Link>
            <Link href="/#contact">联系我们</Link>
            <Link href="/">返回首页</Link>
          </section>
          <section>
            <small>RECRUIT / 招新</small>
            <Link href="/apply" transitionTypes={["nav-forward"]}>在线投递</Link>
            <Link href="/groups">了解组别</Link>
            <Link href="/admin/login">管理员登录</Link>
          </section>
        </nav>
      </div>

      <div className="footer-bottom">
        <span>SMBU ROBOMASTER TEAM · SHENZHEN</span>
        <span>© 2026 POLAR BEAR ROBOTICS</span>
        <Link href="/#top">返回顶部 <b>↑</b></Link>
      </div>
    </footer>
  );
}
