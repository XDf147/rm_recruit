import Link from "next/link";

type ActivePage = "apply" | "groups" | "guide";

export function PublicHeader({ active }: { active: ActivePage }) {
  const links: Array<{ key: ActivePage; href: string; label: string }> = [
    { key: "apply", href: "/apply", label: "简历投递" },
    { key: "groups", href: "/groups", label: "战队组别" },
    { key: "guide", href: "/guide", label: "投递指南" },
  ];
  return (
    <header className="blueprint-header public-header">
      <Link className="brand" href="/apply" aria-label="RoboMaster 招新首页">
        <span className="brand-mark">R</span>
        <span className="brand-copy"><b>RoboMaster</b><small>招新系统 · RM RECRUIT</small></span>
      </Link>
      <nav className="blueprint-nav" aria-label="公开站点导航">
        {links.map((link) => <Link className={active === link.key ? "active" : ""} href={link.href} key={link.key}>{link.label}</Link>)}
      </nav>
      <Link className="admin-entry" href="/admin/login"><span>管理员入口</span><b>→</b></Link>
    </header>
  );
}

export function PublicFooter() {
  return <footer className="public-footer"><span>RM RECRUIT SYSTEM · ENGINEERING BLUEPRINT</span><span>保持好奇 · 持续迭代 · 并肩作战</span></footer>;
}
