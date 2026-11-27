import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GROUP_DETAILS } from "../../lib/groups";
import { PublicFooter, PublicHeader } from "../components/PublicHeader";

export const metadata: Metadata = { title: "组别介绍" };

const portraits = {
  mechanical: "/images/groups/mechanical/机械组.jpg",
  control: "/images/groups/control/电控组.jpg",
  hardware: "/images/groups/hardware/硬件组.jpg",
  algorithm: "/images/groups/algorithm/算法组.jpg",
  operations: "/images/groups/operations/CCTV采访.jpg",
};

export default function GroupsPage() {
  return <div className="group-directory">
    <PublicHeader active="groups" />
    <main className="directory-main">
      <header><div><small>TEAM DIRECTORY</small><h1>组别介绍</h1></div><p>从结构设计到赛事记录，找到你想加入的工作台。</p></header>
      <div className="directory-grid">{GROUP_DETAILS.map((group) => (
        <Link href={`/groups/${group.slug}`} key={group.slug} className="directory-card">
          <Image src={portraits[group.slug]} alt={group.name + "工作与赛场照片"} fill sizes="(max-width: 680px) 100vw, (max-width: 975px) 50vw, 20vw" />
          <div><small>{group.studio}</small><h2>{group.name}</h2><p>{group.role}</p><span>打开组别档案 ↗</span></div>
        </Link>
      ))}</div>
      <aside className="directory-apply"><p>还没确定方向？投递时可以选择“不确定”，和队员聊过再决定。</p><Link href="/apply">加入战队 ↗</Link></aside>
    </main>
    <PublicFooter />
  </div>;
}
